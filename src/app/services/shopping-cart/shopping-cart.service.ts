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
import { isNil } from 'ramda';
import { Observable, of, switchMap } from 'rxjs';
import { CartItem } from 'src/app/models/cart';
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

  addToCart(cartItem: CartItem) {
    const userId = this.account.getMyAccount()?.uid;

    if (isNil(userId)) {
      return;
    }

    generateSKU(
      cartItem.crystalId,
      cartItem.accessories.map(({ accessoryId }) => accessoryId),
    ).then((sku) => {
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
}