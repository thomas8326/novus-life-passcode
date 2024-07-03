import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  runTransaction,
  updateDoc,
} from '@angular/fire/firestore';
import dayjs from 'dayjs';
import { setDoc } from 'firebase/firestore';
import { isNil } from 'ramda';
import { Observable, map, of, switchMap } from 'rxjs';
import { Recipient } from 'src/app/models/account';
import { CartItem, CartRecord, CartRemittanceState } from 'src/app/models/cart';
import { AccountService } from 'src/app/services/account/account.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { generateSKU } from 'src/app/utilities/uniqueKey';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private readonly firestore: Firestore = inject(Firestore);

  constructor(
    private readonly account: AccountService,
    private readonly notifyService: NotifyService,
  ) {}

  getCartItems() {
    return this.account.myAccount$.pipe(
      switchMap((account) =>
        isNil(account)
          ? of([])
          : (collectionData(
              collection(this.firestore, `users/${account.uid}/carts`),
              {
                idField: 'cartId',
              },
            ) as Observable<CartItem[]>),
      ),
    );
  }

  getCartRecords(userId?: string) {
    const account$ = userId
      ? of(userId)
      : this.account.myAccount$.pipe(map((account) => account?.uid));

    return account$.pipe(
      switchMap((id) =>
        isNil(id)
          ? of([])
          : (collectionData(
              collection(this.firestore, `users/${id}/purchaseRecord`),
              {
                idField: 'recordId',
              },
            ) as Observable<CartRecord[]>),
      ),
    );
  }

  addToCart(crystalId: string, cartItem: CartItem) {
    const userId = this.account.getMyAccount()?.uid;

    if (isNil(userId)) {
      console.error('Current user is not found');
      return;
    }

    const accessoryIds = [
      cartItem.mandatoryAccessories,
      cartItem.optionalAccessories,
      cartItem.pendantAccessories,
    ].flatMap((array) => array.map((data) => data.accessory.id || ''));

    generateSKU(crystalId, accessoryIds).then((sku) => {
      const cartDoc = doc(this.firestore, `users/${userId}/carts/${sku}`);

      runTransaction(this.firestore, async (transaction) => {
        const itemDoc = await transaction.get(cartDoc);

        if (itemDoc.exists()) {
          const data = itemDoc.data() as CartItem;
          const newItemQuantity = data.quantity + cartItem.quantity;
          transaction.update(cartDoc, { quantity: newItemQuantity });
        } else {
          transaction.set(cartDoc, cartItem);
        }
      });
    });
  }

  removeCartItem(sku: string) {
    const userId = this.account.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }
    const cartDoc = doc(this.firestore, `users/${userId}/carts/${sku}`);
    deleteDoc(cartDoc);
  }

  checkout(cartItems: CartItem[], recipient: Recipient) {
    const userId = this.account.getMyAccount()?.uid;
    cartItems.forEach((item) => {
      if (item.cartId) {
        const recordRef = doc(
          this.firestore,
          `users/${userId}/purchaseRecord/${item.cartId}`,
        );

        const record: CartRecord = {
          recordId: '',
          cartItem: item,
          recipient,
          remittance: {
            state: 0,
            updatedAt: dayjs().toISOString(),
          },
          feedback: {
            state: 0,
            reason: '',
            createdAt: dayjs().toISOString(),
          },
          createdAt: dayjs().toISOString(),
          feedbackRecords: [],
        };

        setDoc(recordRef, record);
        this.removeCartItem(item.cartId);
      }
    });
  }

  updateQuantity(sku: string, quantity: number) {
    const userId = this.account.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }
    const cartDoc = doc(this.firestore, `users/${userId}/carts/${sku}`);
    updateDoc(cartDoc, { quantity });
  }

  updateCartRecordRemittanceState(
    recordId: string,
    state: CartRemittanceState,
  ) {
    const userId = this.account.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }
    const cartDoc = doc(
      this.firestore,
      `users/${userId}/purchaseRecord/${recordId}`,
    );
    updateDoc(cartDoc, {
      remittance: { state, updatedAt: dayjs().toISOString() },
    });
  }

  updateCartRecord(
    userId: string,
    recordId: string,
    record: Partial<CartRecord>,
  ) {
    if (isNil(userId)) {
      return;
    }
    const cartDoc = doc(
      this.firestore,
      `users/${userId}/purchaseRecord/${recordId}`,
    );
    updateDoc(cartDoc, record);
  }
}
