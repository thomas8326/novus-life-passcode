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
  itemPrice: number;
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
