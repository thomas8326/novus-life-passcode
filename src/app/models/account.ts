import { Gender } from 'src/app/enums/gender.enum';
import { CalculationFeedbackState } from 'src/app/enums/request-record.enum';
import { Delivery } from 'src/app/models/delivery';
import { UserBank } from 'src/app/services/bank/bank.service';

export interface Account {
  uid?: string;
  name: string;
  email: string;

  basicInfos: BasicInfo[];
  remittances: Remittance[];

  enabled: boolean;
  isAdmin: boolean;
  isActivated: boolean;

  calculationRequests: string[];
  cartRecords: string[];
}

export interface AdminAccount extends Account {
  isSuperAdmin?: boolean;
}

export interface BasicInfo {
  uid?: string;
  name: string;
  birthday: string;
  gender: Gender;
  nationalID: string;
  email: string;
}

export interface Remittance {
  uid?: string;
  name: string;
  phone: string;
  email?: string;
  paymentType: 'normal' | 'installment';
  delivery: Delivery;
  bank: UserBank;
}

export interface RequestFeedback {
  state: CalculationFeedbackState;
  reason: string;
  createdAt: string;
  updatedBy?: string;
}

export interface RequestRecord {
  id: string;
  querent: Querent;
  createdAt: string;
  remittance: Remittance;
  remittanceStates: RemittanceState[];
  feedback: RequestFeedback;
  feedbackRecords: RequestFeedback[];
  prices: {
    totalPrice: number;
    itemsPrice: number;
    deliveryFee: number;
  };
}

// 問事者
export interface Querent extends BasicInfo {
  jobOccupation: string;
  wanting: string;
}

export interface Wearer extends BasicInfo {
  wristSize: number | string;
  hasBracelet: boolean;
  braceletImage: string;
}

export enum RemittanceStateType {
  None,
  Paid,
}

export interface RemittanceState {
  state: RemittanceStateType;
  updatedAt: string;
  paidDate: string;
  paid: number;
  bank: UserBank;
}
