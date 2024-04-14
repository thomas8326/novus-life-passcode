import { Injectable, inject } from '@angular/core';
import { Auth, FacebookAuthProvider, user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { isNil, isNotNil } from 'ramda';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import {
  Account,
  MyBasicInfo,
  MyRecipient,
  RequestRecord,
} from 'src/app/models/account';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private myAccountSubject = new BehaviorSubject<Account | null>(null);

  myAccount$ = this.myAccountSubject.asObservable();
  isLogin$ = this.myAccountSubject.pipe(map(isNotNil));

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

  getCalculationRequests() {
    return this.myAccount$.pipe(
      switchMap((myAccount) => {
        if (isNil(myAccount)) {
          return of([]);
        }
        return collectionData(
          collection(
            this.firestore,
            `users/${myAccount.uid}/calculationRequests`,
          ),
          { idField: 'id' },
        ) as Observable<RequestRecord[]>;
      }),
    );
  }

  saveCalculationRequest(basicInfo: MyBasicInfo, receiptInfo: MyRecipient) {
    const myAccount = this.myAccountSubject.value;
    if (isNotNil(myAccount)) {
      setDoc(
        doc(
          this.firestore,
          `users/${myAccount.uid}/calculationRequests/${v4()}`,
        ),
        {
          basicInfo,
          receiptInfo,
          created: new Date().toISOString(),
          status: 'init',
        } as RequestRecord,
      );
    }
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
