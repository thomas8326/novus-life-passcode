export interface Account {
  uid: string;
  name: string;
  avatarLink: string;
  phone: string;
  birthday: string;
}

export interface MyBasicInfo {
  name: string;
  birthday: string;
  gender: string;
  wristSize: number;
  nationalID: string;
  email: string;
  hasBracelet: boolean;
  wantsBox: boolean;
  braceletImage: string;
}

export interface MyRecipient {
  name: string;
  address: string;
  phone: string;
  fiveDigits: string;
}
