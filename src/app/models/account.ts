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
  isSuperAdmin?: boolean;
  isActivated: boolean;

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
export interface Querent {
  name: string;
  birthday: string;
  gender: Gender;
  nationalID: string;
  email: string;
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

export interface Wearer {
  name: string;
  gender: Gender;
  birthday: string;
  nationalID: string;
  email: string;
  wristSize: number;
  hasBracelet: boolean;
  braceletImage: string;
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
  paidDate: string;
  paid: number;
  bank: UserBank;
}
