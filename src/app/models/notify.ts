export interface Notify {
  count: number;
  read: boolean;
}

export interface TotalNotify {
  requestNotify: {
    customer: Notify;
    system: Notify;
  };
  cartNotify: {
    customer: Notify;
    system: Notify;
  };
}
