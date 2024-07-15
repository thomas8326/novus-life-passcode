import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  arrayUnion,
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
import { Remittance, RemittanceStateType } from 'src/app/models/account';
import { CartItem, CartRecord } from 'src/app/models/cart';
import { AccountService } from 'src/app/services/account/account.service';
import { UserBank } from 'src/app/services/bank/bank.service';
import { generateSKU } from 'src/app/utilities/uniqueKey';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private readonly firestore: Firestore = inject(Firestore);

  constructor(private readonly account: AccountService) {}

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

  checkout(cartItems: CartItem[], remittance: Remittance) {
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
          remittance,
          remittanceStates: [],
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

  payCartRecord(recordId: string, bank: UserBank, paid: number) {
    const userId = this.account.getMyAccount()?.uid;

    if (isNil(userId)) {
      console.error('User ID is null or undefined.');
      return;
    }
    const cartDoc = doc(
      this.firestore,
      `users/${userId}/purchaseRecord/${recordId}`,
    );

    const updated = {
      remittanceStates: arrayUnion({
        state: RemittanceStateType.Paid,
        updatedAt: dayjs().toISOString(),
        paid,
        bank,
      }),
    };

    updateDoc(cartDoc, updated);
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
