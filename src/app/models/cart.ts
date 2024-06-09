import { Recipient } from 'src/app/models/account';
import { Crystal } from 'src/app/models/crystal';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';

export interface Cart {
  items: CartItem[];
}

export interface CartItem {
  cartId?: string;
  crystal: Crystal;
  mandatoryAccessories: AccessoryCartItem[];
  optionalAccessories: AccessoryCartItem[];
  pendantAccessories: AccessoryCartItem[];
  quantity: number;
  prices: {
    totalPrice: number;
    discountPrice: number;
    originalPrice: number;
    crystalPrice: number;
    mandatoryItemsPrice: number;
    optionalItemsPrice: number;
    pendantItemsPrice: number;
  };
  createdAt: string;
}

export enum CartRemittanceState {
  None,
  Paid,
  Rejected,
}

export interface CartRecord {
  recordId: string;
  cartItem: CartItem;
  recipient: Recipient;
  remittanceState: CartRemittanceState;
}

export interface AccessoryCartItem {
  accessory: CrystalAccessory;
  quantity: number;
}

export interface CrystalCartItem {
  crystal: Crystal;
  quantity: number;
}
