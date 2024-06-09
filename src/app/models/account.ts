import { Gender } from 'src/app/enums/gender.enum';
import { RecordStatus } from 'src/app/enums/request-record.enum';
export interface Account {
  uid?: string;
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  address: string;

  enabled: boolean;
  isAdmin: boolean;
}

export interface RequestRecord {
  recordTicket: string;
  id?: string;
  basicInfo: MyBasicInfo;
  receiptInfo: Recipient;
  created: string;
  status: RecordStatus;
  statusReason?: string;
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

export interface Recipient {
  name: string;
  phone: string;
  email?: string;
  zipCode: string;
  address: string;
  fiveDigits: string;
  bankCode?: string;
  bankAccount?: string;
}
