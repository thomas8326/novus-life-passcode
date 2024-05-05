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
  collection,
  collectionData,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { isNil, isNotNil } from 'ramda';
import { BehaviorSubject, from, map, of, switchMap, tap } from 'rxjs';
import { Account } from 'src/app/models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private myAccountSubject = new BehaviorSubject<Account | null>(null);

  myAccount$ = this.myAccountSubject.pipe(tap(console.log));
  isLogin$ = this.myAccountSubject.pipe(map(isNotNil));
  loadedMyAccount = false;

  private readonly firestore: Firestore = inject(Firestore);

  getMyAccount() {
    return this.myAccountSubject.value;
  }

  constructor(
    private readonly auth: Auth,
    private readonly fireAuth: AngularFireAuth,
  ) {}

  loginWithFB() {
    return this.fireAuth
      .signInWithPopup(new FacebookAuthProvider())
      .then((data) => {
        if (isNil(data) || isNil(data.user)) {
          return;
        }

        const { phoneNumber, photoURL, displayName, uid } = data.user;

        if (data.additionalUserInfo?.isNewUser) {
          const userData = {
            name: displayName,
            avatarLink: photoURL,
            phone: phoneNumber,
            isAdmin: false,
            enabled: true,
          } as Account;
          setDoc(doc(this.firestore, 'users', uid), userData);

          return Promise.resolve({ ...userData, uid });
        }

        return getDoc(doc(this.firestore, 'users', uid)).then(
          (doc) => ({ ...doc.data(), uid }) as Account,
        );
      })
      .then((userData) => {
        if (userData) {
          this.myAccountSubject.next(userData);
        }
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

  loadAllUsersAccount() {
    return collectionData(collection(this.firestore, `users`), {
      idField: 'uid',
    }).pipe(
      map((users) => users as Account[]),
      map((users) => users.filter((user) => !user.isAdmin)),
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
}
