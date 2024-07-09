import { Gender } from 'src/app/enums/gender.enum';
import {
  CalculationFeedbackState,
  CalculationRemittanceState,
} from 'src/app/enums/request-record.enum';
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

export interface RequestFeedback {
  state: CalculationFeedbackState;
  reason: string;
  createdAt: string;
  updatedBy?: string;
}

export interface RequestRecord {
  recordTicket: string;
  id?: string;
  basicInfo: MyBasicInfo;
  receiptInfo: Remittance;
  createdAt: string;
  remittance: {
    state: CalculationRemittanceState;
    updatedAt: string;
  };
  feedback: RequestFeedback;
  feedbackRecords: RequestFeedback[];
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
  jobOccupation: string;
  wanting: string;
}

export interface Remittance {
  name: string;
  phone: string;
  email?: string;
  zipCode: string;
  address: string;
  fiveDigits: string;
  bankCode?: string;
  bankAccount?: string;
}
