import { UserBank } from 'src/app/services/bank/bank.service';

export interface Pay {
  bank: UserBank;
  paid: number;
  paidDate: string;
}
