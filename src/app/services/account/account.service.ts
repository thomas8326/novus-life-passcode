import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Auth, FacebookAuthProvider, User, user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection } from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { isNil, isNotNil } from 'ramda';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  user = signal<User | null>(null);
  isLogin: Signal<boolean> = computed(() => isNotNil(this.user()));

  private readonly firestore: Firestore = inject(Firestore);
  private readonly usersCollection = collection(this.firestore, 'users');

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
          console.log('user', data.user);
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
      this.user.set(account);
      console.log(account);
    });
  }
}
