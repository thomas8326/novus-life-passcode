import { Gender } from 'src/app/enums/gender.enum';
export interface Account {
  uid: string;
  name: string;
  avatarLink: string;
  phone: string;
  birthday: string;
}

export type RecordStatus = 'init' | 'confirmed' | 'rejected';

export interface RequestRecord {
  id?: string;
  basicInfo: MyBasicInfo;
  receiptInfo: MyRecipient;
  created: string;
  status: RecordStatus;
}

export interface MyBasicInfo {
  name: string;
  birthday: string;
  gender: Gender;
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
