import { Injectable, inject } from '@angular/core';

import { Database, onValue, ref, update } from '@angular/fire/database';

export interface Recipient {
  account: string;
  owner: string;
  calculationRequestPrice?: number;
  bankCode: string;
  bankName: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecipientService {
  private readonly database: Database = inject(Database);
  private readonly PATH = `recipient`;
  private readonly subscriptions: Function[] = [];

  constructor() {}

  listenRecipient(callback: (data: Recipient) => void) {
    const path = `updates/${this.PATH}`;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val() as Recipient;
        callback(val);
      },
      (error) => {
        console.error(error);
      },
    );
    this.subscriptions.push(unsubscribe);
  }

  updateReceipt(recipient: Partial<Recipient>) {
    const updateRef = ref(this.database, `updates/${this.PATH}`);
    update(updateRef, recipient);
  }

  updateRequestPrice(price: number) {
    const updateRef = ref(this.database, `updates/${this.PATH}`);
    update(updateRef, { calculationRequestPrice: price });
  }
}
