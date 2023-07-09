export interface PGSchema {
  version: string;
  paymentKey: string;
  type: PaymentType;
  orderId: string;
  orderName: string;
  mId: string;
  currency: string;
  method: PaymentMethod;
  totalAmount: number;
  balanceAmount: number;
  status: PaymentStatus;
  requestedAt: Date;
  approvedAt: Date;
  useEscrow: boolean;
  lastTransactionKey: string | null;
  suppliedAmount: number;
  vat: number;
  cultureExpense: boolean;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  cancels: PaymentCancel[] | null;
  isPartialCancelable: boolean;
  card: null;
  virtualAccount: VirtualAccount | null;
  secret: string | null;
  mobilePhone: null;
  giftCertificate: null;
  transfer: null;
  receipt: PaymentReceipt | null;
  checkout: PaymentCheckout | null;
  easyPay: null;
  country: string;
  failure: PaymentFailure | null;
  cashReceipt: PaymentCashReceipt | null;
  cashReceipts: PaymentCashReceipts | null;
  discount: PaymentDiscount | null;
}
export type PaymentType = 'NORMAL' | 'BILLING' | 'BRANDPAY';
export type PaymentMethod =
  | '카드'
  | '가상계좌'
  | '간편결제'
  | '휴대폰'
  | '계좌이체'
  | '문화상품권'
  | '도서문화상품권'
  | '게임문화상품권';

export type PaymentStatus =
  | 'READY'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_DEPOSIT'
  | 'DONE'
  | 'CANCELED'
  | 'PARTIAL_CANCELED'
  | 'ABORTED'
  | 'EXPIRED';
export interface PaymentCancel {
  cancelAmount: number;
  cancelReason: string;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  refundableAmount: number;
  easyPayDiscountAmount: number;
  canceledAt: string;
  transactionKey: string;
  receiptKey: string;
}
export interface VirtualAccount {
  accountType: VirtualAccountType;
  accountNumber: number;
  bankCode: string;
  customerName: string;
  dueDate: string;
  refundStatus: VirtualAccountStatus;
  expired: boolean;
  settlementStatus: VirtualAccountSettlementStatus;
  refundReceiveAccount: VirtualAccountRefundReceiveAccount;
}
export type VirtualAccountType = '일반' | '고정';
export type VirtualAccountStatus =
  | 'NONE'
  | 'PENDING'
  | 'FAILED'
  | 'PARTIAL_FAILED'
  | 'COMPLETED';
export type VirtualAccountSettlementStatus = 'INCOMPLETED' | 'COMPLETED';
export interface VirtualAccountRefundReceiveAccount {
  bankCode: string;
  accountNumber: number;
  holderName: string;
}
export interface PaymentReceipt {
  url: string;
}
export interface PaymentCheckout {
  url: string;
}
export interface PaymentFailure {
  code: string;
  message: string;
}
export interface PaymentCashReceipt {
  type: CashReceiptType;
  receiptKey: string;
  issueNumber: string;
  receiptUrl: string;
  amount: number;
  taxFreeAmount: number;
}
export type CashReceiptType = '소득공제' | '지출증빙' | '미발행';
export interface PaymentCashReceipts {
  receiptKey: string;
  orderId: string;
  orderName: string;
  type: CashReceiptsType;
  issueNumber: string;
  receiptUrl: string;
  businessNumber: string;
  transactionType: CashReceiptsTransactionType;
  amount: number;
  taxFreeAmount: number;
  issueStatus: CashReceiptsIssueStatus;
  failure: CashReceiptsFailure;
  customerIdentityNumber: string;
  requestedAt: string;
}
[];
export type CashReceiptsType = '소득공제' | '지출증빙';
export type CashReceiptsTransactionType = 'CONFIRM' | 'CANCEL';
export type CashReceiptsIssueStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
export interface CashReceiptsFailure {
  code: string;
  message: string;
}
export interface PaymentDiscount {
  amount: number;
}
