import { err, ok } from 'src/core';
import { PaymentStatus } from '../base/payment-status.value-object';
import {
  CreatePaymentProps,
  Payment,
  PaymentProps,
} from '../base/payment.aggregate-root';
import { Order } from '../base/order/order.entity';
import { Amount } from '../amount.value-object';

interface VirtualAccountPaymentProps
  extends PaymentProps<VirtualAccountMethod> {
  bank: string;
  bankCode: string;
  customerName: string;
  accountNumber: string;
  dueDate: Date;
}
export const VIRTUAL_ACCOUNT_METHOD = 'VIRTUAL_ACCOUNT';
export type VirtualAccountMethod = typeof VIRTUAL_ACCOUNT_METHOD;
export type CreateVirtualAccountPaymentProps = CreatePaymentProps & {
  bank: string;
  bankCode: string;
  customerName: string;
  accountNumber: string;
  dueDate: Date;
};

export class VirtualAccountPayment extends Payment<
  VirtualAccountMethod,
  VirtualAccountPaymentProps
> {
  get bank(): string {
    return this.props.bank;
  }

  get bankCode(): string {
    return this.props.bankCode;
  }

  get accountNumber(): string {
    return this.props.accountNumber;
  }

  get customerName(): string {
    return this.props.customerName;
  }

  get dueDate(): Date {
    return this.props.dueDate;
  }

  get isExpired(): boolean {
    return this.props.dueDate.getTime() < Date.now();
  }

  public static create(props: CreateVirtualAccountPaymentProps) {
    const amountOrError = Amount.create(props.amount);
    if (amountOrError.isErr()) return err(amountOrError.error);

    return ok(
      new VirtualAccountPayment({
        ...props,
        method: 'VIRTUAL_ACCOUNT',
        amount: amountOrError.value,
        order: Order.create(props.order),
        status: PaymentStatus.create({ value: null }),
        updatedAt: new Date(),
        createdAt: new Date(),
      }),
    );
  }

  private constructor(props: VirtualAccountPaymentProps) {
    super(props);
  }
}
