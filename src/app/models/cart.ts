export interface Cart {
  items: CartItem[];
}

export interface CartItem {
  cartId?: string;
  crystalId: string;
  accessoryId?: string;
  accessories: AccessoryCartItem[];
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export interface AccessoryCartItem {
  accessoryId: string;
  quantity: number;
}
