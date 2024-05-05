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
import { BehaviorSubject, map } from 'rxjs';
import { Account } from 'src/app/models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private myAccountSubject = new BehaviorSubject<Account | null>(null);

  myAccount$ = this.myAccountSubject.asObservable();
  isLogin$ = this.myAccountSubject.pipe(map(isNotNil));

  private readonly firestore: Firestore = inject(Firestore);

  getMyAccount() {
    return this.myAccountSubject.value;
  }

  constructor(
    private readonly auth: Auth,
    private readonly fireAuth: AngularFireAuth,
  ) {
    this.loadMyAccount();
  }

  loginWithFB() {
    return new Promise<void>((resolve) => {
      this.fireAuth.signInWithPopup(new FacebookAuthProvider()).then((data) => {
        if (isNil(data)) {
          return;
        }

        if (data.additionalUserInfo?.isNewUser && isNotNil(data.user)) {
          const { phoneNumber, photoURL, displayName, uid } = data.user;
          setDoc(doc(this.firestore, 'users', uid), {
            name: displayName,
            avatarLink: photoURL,
            phone: phoneNumber,
            isAdmin: false,
            enabled: true,
          } as Account);
        }

        resolve();
      });
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
    return this.fireAuth.signOut();
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

  private async loadMyAccount() {
    user(this.auth).subscribe((account) => {
      if (account?.uid) {
        getDoc(doc(this.firestore, 'users', account.uid)).then((doc) => {
          this.myAccountSubject.next({
            ...doc.data(),
            uid: account.uid,
          } as Account);
        });
      }
    });
  }
}
