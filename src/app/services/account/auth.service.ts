import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Auth,
  FacebookAuthProvider,
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { isNil } from 'src/app/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  private loginState = signal<{
    loggedIn: boolean;
    user: User | null;
  }>({ loggedIn: false, user: null });

  isLogin = computed(() => this.loginState().loggedIn);
  user = computed(() => this.loginState().user);
  userNotVerified = computed(
    () => this.isLogin() && !this.loginState().user?.emailVerified,
  );

  constructor() {
    this.auth.onAuthStateChanged((user) => {
      this.loginState.set({
        loggedIn: !!user,
        user: user,
      });
    });
  }

  getFireAuthCurrentUser() {
    return this.auth.currentUser;
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
            return doc.get('isAdmin') && doc.get('enabled');
          });
        }

        return false;
      },
    );
  }

  logout(forceRedirect = true) {
    forceRedirect && (window.location.href = '/');
    return signOut(this.auth);
  }
}
