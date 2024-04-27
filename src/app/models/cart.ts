export interface Cart {
  items: CartItem[];
}

export interface CartItem {
  cartId?: string;
  crystalId: string;
  accessoryId: string;
  quantity: number;
}
