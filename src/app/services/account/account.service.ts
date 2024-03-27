import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Auth, FacebookAuthProvider, user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { isNil, isNotNil } from 'ramda';
import { Account } from 'src/app/models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  myAccount = signal<Account | null>(null);
  isLogin: Signal<boolean> = computed(() => isNotNil(this.myAccount()));

  private readonly firestore: Firestore = inject(Firestore);

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

  private async loadMyAccount() {
    user(this.auth).subscribe((account) => {
      if (account?.uid) {
        getDoc(doc(this.firestore, 'users', account.uid)).then((doc) => {
          this.myAccount.set(doc.data() as Account);
        });
      }
    });
  }
}
