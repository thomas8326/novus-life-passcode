export enum CalculationRemittanceState {
  None,
  Paid,
}

export enum CalculationFeedbackState {
  Init,
  Pending,
  Confirmed,
  Rejected,
}

export const CalculationFeedbackStateMap = {
  0: '尚未確認',
  1: '正在確認訂單',
  2: '出貨中/確認完成',
  3: '拒絕訂單',
};
