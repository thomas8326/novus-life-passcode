import { Injectable, inject } from '@angular/core';
import {
  Auth,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  user,
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
} from '@angular/fire/firestore';
import { limit } from 'firebase/firestore';
import { isNil } from 'ramda';
import { BehaviorSubject, from, map, of, switchMap } from 'rxjs';
import { Account } from 'src/app/models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private myAccountSubject = new BehaviorSubject<Account | null>(null);
  private loginSubject = new BehaviorSubject<{
    loggedIn: boolean;
    uid: string;
    email: string;
  }>({ loggedIn: false, uid: '', email: '' });

  myAccount$ = this.myAccountSubject.asObservable();
  loginState$ = this.loginSubject.asObservable();
  loadedMyAccount = false;

  private readonly firestore: Firestore = inject(Firestore);

  getMyAccount() {
    return this.myAccountSubject.value;
  }

  constructor(
    private readonly auth: Auth,
    private readonly fireAuth: AngularFireAuth,
  ) {
    this.auth.onAuthStateChanged((user) => {
      this.loginSubject.next({
        loggedIn: !!user,
        uid: user?.uid || '',
        email: user?.email || '',
      });
    });
  }

  loginWithFB() {
    return this.fireAuth
      .signInWithPopup(new FacebookAuthProvider())
      .then((data) => {
        if (isNil(data) || isNil(data.user)) {
          throw new Error('Create user failed');
        }

        const { user, additionalUserInfo } = data;
        return {
          isNewUser: additionalUserInfo?.isNewUser || false,
          uid: user.uid,
        };
      });
  }

  loginWithEmail(email: string, password: string) {
    return this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (isNil(userCredential.user)) {
          throw new Error('Create user failed');
        }

        return {
          uid: userCredential.user.uid,
        };
      });
  }

  signUpWithEmail(email: string, password: string) {
    return this.fireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (isNil(userCredential.user)) {
          throw new Error('Create user failed');
        }

        return {
          isNewUser: true,
          uid: userCredential.user.uid,
        };
      });
  }

  loginAdmin(email: string, password: string): Promise<boolean> {
    return this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
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
      });
  }

  logout() {
    return this.fireAuth.signOut().then(() => {
      this.myAccountSubject.next(null);
    });
  }

  fetchMyAccount(uid: string) {
    return getDoc(doc(this.firestore, 'users', uid))
      .then((doc) => ({ ...doc.data(), uid }) as Account)
      .then((account) => {
        this.myAccountSubject.next(account);
        this.loadedMyAccount = true;
        return account;
      });
  }

  updateUserAccount(account: Partial<Account>) {
    const userData = {
      ...account,
      isAdmin: false,
      enabled: true,
    } as Account;
    return this.fireAuth.currentUser.then((user) => {
      if (user) {
        setDoc(doc(this.firestore, 'users', user.uid), userData);
      }
    });
  }

  loadAllUsersAccount() {
    return collectionData(collection(this.firestore, `users`), {
      idField: 'uid',
    }).pipe(
      map((users) => users as Account[]),
      map((users) => users.filter((user) => !user.isAdmin)),
    );
  }

  loadPaginationUsersAccount(page: number) {
    console.log(page);
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
    createUserWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        if (isNil(userCredential.user)) {
          return;
        }

        const { uid } = userCredential.user;

        if (uid) {
          setDoc(doc(this.firestore, 'users', uid), {
            name: alias,
            email,
            isAdmin: true,
            enabled: true,
          } as Account);
        }
      },
    );
  }

  enabledAdminAccount(uid: string, enabled: boolean) {
    updateDoc(doc(this.firestore, 'users', uid), {
      enabled,
    });
  }

  loadAdmins() {
    return collectionData(collection(this.firestore, 'users'), {
      idField: 'uid',
    }).pipe(
      map((users) => users as Account[]),
      map((users) => users.filter((user) => user.isAdmin)),
    );
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
