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
import { setDoc } from 'firebase/firestore';
import { isNil } from 'ramda';
import { Observable, of, switchMap } from 'rxjs';
import { Recipient } from 'src/app/models/account';
import { CartItem, CartRecord, CartRemittanceState } from 'src/app/models/cart';
import { AccountService } from 'src/app/services/account/account.service';
import { generateSKU } from 'src/app/utilities/uniqueKey';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private readonly firestore: Firestore = inject(Firestore);

  constructor(private account: AccountService) {}

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

  getCartRecords() {
    return this.account.myAccount$.pipe(
      switchMap((account) =>
        isNil(account)
          ? of([])
          : (collectionData(
              collection(this.firestore, `users/${account.uid}/purchaseRecord`),
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
          remittanceState: 0,
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

  removeCartItem(sku: string) {
    const userId = this.account.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }
    const cartDoc = doc(this.firestore, `users/${userId}/carts/${sku}`);
    deleteDoc(cartDoc);
  }

  updateRemittanceState(recordId: string, state: CartRemittanceState) {
    const userId = this.account.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }
    const cartDoc = doc(
      this.firestore,
      `users/${userId}/purchaseRecord/${recordId}`,
    );
    updateDoc(cartDoc, { remittanceState: state });
  }
}
