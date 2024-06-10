import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import dayjs from 'dayjs';
import { isNotNil } from 'ramda';
import { Observable } from 'rxjs';
import { MyBasicInfo, Recipient, RequestRecord } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account/account.service';
import { encodeTimestamp } from 'src/app/utilities/uniqueKey';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CalculationRequestService {
  private readonly firestore: Firestore = inject(Firestore);

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
}
