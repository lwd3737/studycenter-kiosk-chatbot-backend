import {
  CreatePaymentProps,
  Payment,
  PaymentProps,
} from './base/payment.aggregate-root';

interface VirtualAccountPaymentProps extends PaymentProps {
  bank: string;
  bankCode: string;
  customerName: string;
  accountNumber: string;
  dueDate: Date;
}
export const VIRTUAL_ACCOUNT_METHOD = 'virtual_account';
export type VirtualAccountMethod = typeof VIRTUAL_ACCOUNT_METHOD;
export type CreateVirtualAccountPaymentProps = CreatePaymentProps &
  VirtualAccountPaymentProps;

export class VirtualAccountPayment extends Payment<VirtualAccountPaymentProps> {
  get bank(): string {
    return this.props.bank;
  }

  get bankCode(): string {
    return this.props.bankCode;
  }

  get accountNumber(): string {
    return this.props.accountNumber;
  }

  get dueDate(): Date {
    return this.props.dueDate;
  }

  get expired(): boolean {
    return this.props.dueDate.getTime() < Date.now();
  }

  public static create(props: CreateVirtualAccountPaymentProps) {
    return new VirtualAccountPayment(props);
  }

  private constructor(props: VirtualAccountPaymentProps) {
    super(props);
  }
}
