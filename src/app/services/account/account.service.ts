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
import { BehaviorSubject, map, of, switchMap } from 'rxjs';
import { Account, AdminAccount } from 'src/app/models/account';

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
          });
        }

        resolve();
      });
    });
  }

  loadAllUsersAccount() {
    return collectionData(collection(this.firestore, `users`), {
      idField: 'uid',
    }).pipe(switchMap((users) => of(users as Account[])));
  }

  createAdminAccount(alias: string, email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        if (isNil(userCredential.user)) {
          return;
        }

        const { uid } = userCredential.user;

        if (uid) {
          setDoc(doc(this.firestore, 'admins', uid), {
            name: alias,
            email,
            enabled: true,
          });
        }
      },
    );
  }

  enabledAdminAccount(uid: string, enabled: boolean) {
    updateDoc(doc(this.firestore, 'admins', uid), {
      enabled,
    });
  }

  loadAdmins() {
    return collectionData(collection(this.firestore, 'admins'), {
      idField: 'uid',
    }).pipe(switchMap((users) => of(users as AdminAccount[])));
  }

  private async loadMyAccount() {
    user(this.auth).subscribe((account) => {
      if (account?.uid) {
        console.log('Im');
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
