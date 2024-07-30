import { Injectable, inject } from '@angular/core';
import { Database, onValue, ref, update } from '@angular/fire/database';

export interface Prices {
  calculationRequestPrice: number;
  deliveryToHome: number;
  deliveryToStore: number;
  freeTransportation: number;
}

export const DEFAULT_PRICES: Prices = {
  deliveryToHome: 85,
  deliveryToStore: 60,
  calculationRequestPrice: 500,
  freeTransportation: 3000,
};

@Injectable({
  providedIn: 'root',
})
export class PricesService {
  private readonly database: Database = inject(Database);
  private readonly PATH = `prices`;
  private subscriptions: Function[] = [];

  constructor() {}

  listenPrices(callback: (data: Prices) => void) {
    const path = `updates/${this.PATH}`;
    const dbRef = ref(this.database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val() as Prices;
        callback(val);
      },
      (error) => {
        console.error(error);
      },
    );
    this.subscriptions.push(unsubscribe);
  }

  updateRequestPrice(price: number) {
    const updateRef = ref(this.database, `updates/${this.PATH}`);
    update(updateRef, { calculationRequestPrice: price });
  }

  updateDeliveryToHome(price: number) {
    const updateRef = ref(this.database, `updates/${this.PATH}`);
    update(updateRef, { deliveryToHome: price });
  }

  updateDeliveryToStore(price: number) {
    const updateRef = ref(this.database, `updates/${this.PATH}`);
    update(updateRef, { deliveryToStore: price });
  }

  updateFreeTransportation(price: number) {
    const updateRef = ref(this.database, `updates/${this.PATH}`);
    update(updateRef, { freeTransportation: price });
  }

  unsubscribeAll() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
  }
}
