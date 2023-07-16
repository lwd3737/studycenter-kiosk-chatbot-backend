import { DomainError, Result, err, ok } from 'src/core';

import {
  CreatePaymentProps,
  Payment,
  PaymentProps,
} from '../base/payment.aggregate-root';
import { DueDate } from './due-date.value-object';

interface VirtualAccountPaymentProps
  extends PaymentProps<VirtualAccountMethod> {
  bank: string;
  bankCode: string;
  customerName: string;
  accountNumber: string;
  dueDate: DueDate;
}
export const VIRTUAL_ACCOUNT_METHOD = 'virtualAccount';
export type VirtualAccountMethod = typeof VIRTUAL_ACCOUNT_METHOD;
export type CreateVirtualAccountPaymentProps = Pick<
  CreatePaymentProps<VirtualAccountMethod>,
  'memberId' | 'order' | 'secret' | 'totalAmount' | 'status'
> & {
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
  public static new(
    props: CreateVirtualAccountPaymentProps,
  ): Result<VirtualAccountPayment, DomainError> {
    const paymentPropsOrError = super.createProps<VirtualAccountMethod>({
      ...props,
      method: VIRTUAL_ACCOUNT_METHOD,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (paymentPropsOrError.isErr()) return err(paymentPropsOrError.error);

    return ok(
      new VirtualAccountPayment({
        ...paymentPropsOrError.value,
        bank: props.bank,
        bankCode: props.bankCode,
        customerName: props.customerName,
        accountNumber: props.accountNumber,
        dueDate: DueDate.create({ value: props.dueDate }),
      }),
    );
  }

  private constructor(props: VirtualAccountPaymentProps) {
    super(props);
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

  get dueDate(): DueDate {
    return this.props.dueDate;
  }

  get isExpired(): boolean {
    if (!this.props.dueDate) return false;
    return this.props.dueDate.value.getTime() < Date.now();
  }
}
