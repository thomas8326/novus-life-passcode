import { Injectable, inject } from '@angular/core';

import { Database, onValue, ref, update } from '@angular/fire/database';

export interface Remittance {
  account: string;
  calculationRequestPrice: number;
  bankCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class RemittanceService {
  private readonly database: Database = inject(Database);
  private readonly PATH = `remittance`;
  private readonly subscriptions: Function[] = [];

  constructor() {}

  listenRemittance(callback: (data: Remittance) => void) {
    const path = `updates/${this.PATH}`;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val() as Remittance;
        callback(val);
      },
      (error) => {
        console.error(error);
      },
    );
    this.subscriptions.push(unsubscribe);
  }

  updateAccount(account: string) {
    const updateRef = ref(this.database, `updates/${this.PATH}`);
    update(updateRef, { account });
  }

  updateRequestPrice(price: number) {
    const updateRef = ref(this.database, `updates/${this.PATH}`);
    update(updateRef, { calculationRequestPrice: price });
  }

  updateBankCode(code: string) {
    const updateRef = ref(this.database, `updates/${this.PATH}`);
    update(updateRef, { bankCode: code });
  }
}
