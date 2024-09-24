export interface Delivery {
  deliveryType: '711' | 'address';
  address: string;
  storeName: string;
  storeId: string;
  zipCode: string;
}
