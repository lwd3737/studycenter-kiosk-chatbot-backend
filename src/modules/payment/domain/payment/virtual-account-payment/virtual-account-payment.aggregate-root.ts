import { DomainError, Result, err, ok } from 'src/core';

import {
  CreatePaymentProps,
  BasePayment,
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
  createdAt?: Date;
  updatedAt?: Date;
};

export class VirtualAccountPayment extends BasePayment<
  VirtualAccountMethod,
  VirtualAccountPaymentProps
> {
  public static create(
    props: CreateVirtualAccountPaymentProps,
    id?: string,
  ): Result<VirtualAccountPayment, DomainError> {
    const paymentPropsOrError = super.createProps<VirtualAccountMethod>({
      ...props,
      method: VIRTUAL_ACCOUNT_METHOD,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
    if (paymentPropsOrError.isErr()) return err(paymentPropsOrError.error);

    return ok(
      new VirtualAccountPayment(
        {
          ...paymentPropsOrError.value,
          bank: props.bank,
          bankCode: props.bankCode,
          customerName: props.customerName,
          accountNumber: props.accountNumber,
          dueDate: DueDate.create({ value: props.dueDate }),
        },
        id,
      ),
    );
  }

  private constructor(props: VirtualAccountPaymentProps, id?: string) {
    super(props, id);
  }

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

  get dueDate(): DueDate {
    return this.props.dueDate;
  }

  get isExpired(): boolean {
    if (!this.props.dueDate) return false;
    return this.props.dueDate.value.getTime() < Date.now();
  }
}
