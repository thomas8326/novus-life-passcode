import { Remittance, RemittanceState } from 'src/app/models/account';
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

export enum CartFeedbackState {
  None,
  Pending,
  Confirmed,
  Rejected,
}

export const CartFeedbackStateMap = {
  0: '尚未確認',
  1: '正在確認訂單',
  2: '出貨中/完成訂單',
  3: '拒絕訂單',
};

export interface CartFeedback {
  state: CartFeedbackState;
  reason: string;
  createdAt: string;
  updatedBy?: string;
}

export interface CartRecord {
  recordId: string;
  cartItem: CartItem;
  remittance: Remittance;
  remittanceStates: RemittanceState[];
  feedback: CartFeedback;
  feedbackRecords: CartFeedback[];
  createdAt: string;
}

export interface AccessoryCartItem {
  accessory: CrystalAccessory;
  quantity: number;
}

export interface CrystalCartItem {
  crystal: Crystal;
  quantity: number;
}
