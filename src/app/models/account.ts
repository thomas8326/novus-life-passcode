import { Gender } from 'src/app/enums/gender.enum';
import { CalculationFeedbackState } from 'src/app/enums/request-record.enum';
import { Delivery } from 'src/app/models/delivery';
import { UserBank } from 'src/app/services/bank/bank.service';
export interface Account {
  uid?: string;
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  address: string;

  enabled: boolean;
  isAdmin: boolean;

  calculationRequests: string[];
  cartRecords: string[];
}

export interface RequestFeedback {
  state: CalculationFeedbackState;
  reason: string;
  createdAt: string;
  updatedBy?: string;
}

export interface RequestRecord {
  id: string;
  basicInfo: MyBasicInfo;
  createdAt: string;
  remittance: Remittance;
  remittanceStates: RemittanceState[];
  feedback: RequestFeedback;
  feedbackRecords: RequestFeedback[];
  prices: {
    totalPrice: number;
  };
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
  paymentType: 'normal' | 'installment';
  delivery: Delivery;
  bank: UserBank;
}

export interface DeliveryRemittance {
  name: string;
  phone: string;
  email?: string;
  zipCode: string;
  address: string;
  bank: UserBank;
  storeName: string;
}

export enum RemittanceStateType {
  None,
  Paid,
}

export interface RemittanceState {
  state: RemittanceStateType;
  updatedAt: string;
  paid: number;
  bank: UserBank;
}
