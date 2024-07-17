import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  arrayUnion,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Storage, ref as storageRef, uploadBytes } from '@angular/fire/storage';
import dayjs from 'dayjs';
import { isNil, isNotNil } from 'ramda';
import { Observable } from 'rxjs';
import {
  MyBasicInfo,
  Remittance,
  RemittanceStateType,
  RequestRecord,
} from 'src/app/models/account';
import { AccountService } from 'src/app/services/account/account.service';
import { UserBank } from 'src/app/services/bank/bank.service';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CalculationRequestService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly storage: Storage = inject(Storage);

  constructor(private account: AccountService) {}

  getCalculationRequests(userUid: string) {
    return collectionData(
      collection(this.firestore, `users/${userUid}/calculationRequests`),
      { idField: 'id' },
    ) as Observable<RequestRecord[]>;
  }

  checkoutCalculationRequest(
    basicInfo: MyBasicInfo,
    remittance: Remittance,
    prices: { totalPrice: number },
  ) {
    const myAccount = this.account.getMyAccount();
    const created = dayjs();
    const id = v4();

    if (isNotNil(myAccount)) {
      return setDoc(
        doc(this.firestore, `users/${myAccount.uid}/calculationRequests/${id}`),
        {
          basicInfo,
          createdAt: created.format(),
          remittance,
          remittanceStates: [],
          feedback: {
            state: 0,
            reason: '',
            createdAt: dayjs().toISOString(),
          },
          feedbackRecords: [],
          prices,
        } as RequestRecord,
      )
        .then(() => this.account.addRecordId('calculationRequests', id))
        .then(() => ({ id }));
    }

    return Promise.reject('No account');
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

  payRequestRecord(recordId: string, bank: UserBank, paid: number) {
    const userId = this.account.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }
    const requestDoc = doc(
      this.firestore,
      `users/${userId}/calculationRequests/${recordId}`,
    );

    const updated = {
      remittanceStates: arrayUnion({
        state: RemittanceStateType.Paid,
        updatedAt: dayjs().toISOString(),
        paid,
        bank,
      }),
    };

    updateDoc(requestDoc, updated);
  }

  uploadRequestImage(file: File) {
    const requestRef = storageRef(this.storage, `requests/` + file.name);
    return uploadBytes(requestRef, file).then((data) => {
      const { bucket, fullPath } = data.metadata;
      const gsUrl = `gs://${bucket}/${fullPath}`;
      return gsUrl;
    });
  }
}
