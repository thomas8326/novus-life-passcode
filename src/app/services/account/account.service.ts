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
  updateDoc,
} from '@angular/fire/firestore';
import dayjs from 'dayjs';
import { isNil, isNotNil } from 'ramda';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { RecordStatus } from 'src/app/enums/request-record.enum';
import {
  Account,
  MyBasicInfo,
  MyRecipient,
  RequestRecord,
} from 'src/app/models/account';
import { encodeTimestamp } from 'src/app/utilities/uniqueKey';
import { v4 } from 'uuid';

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

  getCalculationRequests(userUid: string) {
    return collectionData(
      collection(this.firestore, `users/${userUid}/calculationRequests`),
      { idField: 'id' },
    ) as Observable<RequestRecord[]>;
  }

  saveCalculationRequest(basicInfo: MyBasicInfo, receiptInfo: MyRecipient) {
    const myAccount = this.myAccountSubject.value;
    const created = dayjs();
    const recordTicket = `${basicInfo.name}-${created.format('MM/DD')}-${encodeTimestamp(dayjs().valueOf())}`;

    if (isNotNil(myAccount)) {
      setDoc(
        doc(
          this.firestore,
          `users/${myAccount.uid}/calculationRequests/${v4()}`,
        ),
        {
          recordTicket,
          basicInfo,
          receiptInfo,
          created: created.format(),
          status: RecordStatus.Init,
        } as RequestRecord,
      );
    }
  }

  updateCalculationRequest(
    userId: string,
    recordId: string,
    record: Partial<RequestRecord>,
  ) {
    updateDoc(
      doc(this.firestore, `users/${userId}/calculationRequests/${recordId}`),
      record,
    );
  }

  loadAllUsersAccount() {
    return collectionData(collection(this.firestore, `users`), {
      idField: 'uid',
    }).pipe(switchMap((users) => of(users as Account[])));
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
