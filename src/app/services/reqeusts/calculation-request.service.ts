import { Injectable, inject } from '@angular/core';
import {
  Firestore,
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
import { CalculationRemittanceState } from 'src/app/enums/request-record.enum';
import { MyBasicInfo, Recipient, RequestRecord } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account/account.service';
import { encodeTimestamp } from 'src/app/utilities/uniqueKey';
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

  saveCalculationRequest(basicInfo: MyBasicInfo, receiptInfo: Recipient) {
    const myAccount = this.account.getMyAccount();
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
          createdAt: created.format(),

          remittance: {
            state: 0,
            updatedAt: dayjs().toISOString(),
          },
          feedback: {
            state: 0,
            reason: '',
            createdAt: dayjs().toISOString(),
          },
          feedbackRecords: [],
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

  updateCalculationRemittanceState(
    recordId: string,
    state: CalculationRemittanceState,
  ) {
    const userId = this.account.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }
    const cartDoc = doc(
      this.firestore,
      `users/${userId}/calculationRequests/${recordId}`,
    );
    updateDoc(cartDoc, {
      remittance: { state, updatedAt: dayjs().toISOString() },
    });
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
