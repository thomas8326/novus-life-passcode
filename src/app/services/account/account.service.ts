import { Injectable, inject } from '@angular/core';
import {
  Auth,
  FacebookAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';
import {
  Firestore,
  arrayUnion,
  collection,
  collectionData,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { limit } from 'firebase/firestore';
import {
  BehaviorSubject,
  Observable,
  catchError,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';
import { isNil } from 'src/app/common/utilities';
import { Account } from 'src/app/models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private myAccountSubject = new BehaviorSubject<Account | null>(null);
  private loginSubject = new BehaviorSubject<{
    loggedIn: boolean;
    user: User | null;
  }>({ loggedIn: false, user: null });

  myAccount$ = this.myAccountSubject.asObservable();
  loginState$ = this.loginSubject.asObservable();
  loadedMyAccount = false;

  private readonly firestore: Firestore = inject(Firestore);

  getFireAuthCurrentUser() {
    return this.auth.currentUser;
  }

  getMyAccount() {
    return this.myAccountSubject.value;
  }

  getClaims(): Observable<Record<string, any> | null> {
    return of(this.auth.currentUser).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }
        return from(user.getIdTokenResult());
      }),
      map((idTokenResult) => idTokenResult?.claims || null),
      catchError((error) => {
        console.error('Error fetching claims:', error);
        return of(null);
      }),
    );
  }

  constructor(
    private readonly auth: Auth,
    private readonly functions: Functions,
  ) {
    this.auth.onAuthStateChanged((user) => {
      this.loginSubject.next({
        loggedIn: !!user,
        user: user,
      });
    });
  }

  loginWithFB() {
    return signInWithPopup(this.auth, new FacebookAuthProvider());
  }

  loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      async (userCredential) => {
        const user = userCredential.user;

        if (isNil(user)) {
          throw new Error('Create user failed');
        }

        return sendEmailVerification(user);
      },
    );
  }

  loginAdmin(email: string, password: string): Promise<boolean> {
    return signInWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        if (isNil(userCredential.user)) {
          return false;
        }

        const { uid } = userCredential.user;
        if (uid) {
          return getDoc(doc(this.firestore, 'users', uid)).then((doc) => {
            this.myAccountSubject.next({
              ...doc.data(),
              uid: uid,
            } as Account);

            return doc.get('isAdmin') && doc.get('enabled');
          });
        }

        return false;
      },
    );
  }

  logout() {
    window.location.href = '/';
    return signOut(this.auth).then(() => {
      this.myAccountSubject.next(null);
    });
  }

  fetchMyAccount(currentUser: User | null) {
    if (isNil(currentUser)) {
      throw new Error('Create user failed');
    }

    return getDoc(doc(this.firestore, 'users', currentUser.uid))
      .then((doc) => ({ ...doc.data(), uid: currentUser.uid }) as Account)
      .then((account) => {
        let _account = {
          ...account,
          isActivated: currentUser.emailVerified,
        } as Account;

        if (currentUser.emailVerified && !account.isActivated) {
          this.updateUserAccount(currentUser.uid, { isActivated: true });
          _account = { ..._account, isActivated: true };
        }

        this.myAccountSubject.next(_account);
        this.loadedMyAccount = true;
        return _account;
      });
  }

  updateUserAccount(uid: string, account: Partial<Account>) {
    return updateDoc(doc(this.firestore, 'users', uid), account);
  }

  setUserAccount(uid: string, account: Account) {
    return setDoc(doc(this.firestore, 'users', uid), account);
  }

  loadAllUsersAccount() {
    const usersRef = collection(this.firestore, 'users');
    const q = query(
      usersRef,
      where('isAdmin', '==', false),
      orderBy('isActivated', 'desc'),
    );

    return collectionData(q, { idField: 'uid' }).pipe(
      map((users) => users as Account[]),
    );
  }

  loadPaginationUsersAccount(page: number) {
    const ref = collection(this.firestore, `users`);
    const q = query(ref, orderBy('name'), startAfter(page), limit(1));

    return Promise.all([getCountFromServer(ref), getDocs(q)]).then(
      ([count, docs]) => {
        docs.docs.forEach((d) => {
          console.log(d.data());
        });
        // console.log('docs.docs', docs.docs);

        return {
          count: count.data().count,
          docs: docs.docs.map((d) => ({ uid: d.id, ...d.data() })) as Account[],
        };
      },
    );
  }

  createAdminAccount(alias: string, email: string, password: string) {
    const createAdmin = httpsCallable<
      { alias: string; email: string; password: string },
      UserCredential
    >(this.functions, 'createAdminUser');

    return createAdmin({ alias, email, password });
  }

  enabledAdminAccount(uid: string, enabled: boolean) {
    updateDoc(doc(this.firestore, 'users', uid), {
      enabled,
    });
  }

  loadAdmins() {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('isAdmin', '==', true));

    return collectionData(q, {
      idField: 'uid',
    }).pipe(map((users) => users as Account[]));
  }

  loadMyAccount() {
    if (!this.loadedMyAccount) {
      return user(this.auth).pipe(
        switchMap((account) => {
          if (account?.uid) {
            return from(getDoc(doc(this.firestore, 'users', account.uid))).pipe(
              map((doc) => {
                const userData = { ...doc.data(), uid: account.uid } as Account;
                this.myAccountSubject.next(userData);
                this.loadedMyAccount = true;
                return userData;
              }),
            );
          } else {
            return of(null);
          }
        }),
      );
    } else {
      return this.myAccountSubject.asObservable();
    }
  }

  addRecordId(field: 'calculationRequests' | 'cartRecords', id: string) {
    const userId = this.getMyAccount()?.uid;

    if (isNil(userId)) {
      console.error('Current user is not found');
      return;
    }

    const updated = {
      [field]: arrayUnion(id),
    };

    return updateDoc(doc(this.firestore, `users/${userId}`), updated).then(
      () => ({ id }),
    );
  }
}
