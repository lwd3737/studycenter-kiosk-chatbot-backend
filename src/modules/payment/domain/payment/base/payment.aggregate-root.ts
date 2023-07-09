import { AggregateRoot, EntityId } from 'src/core';
import { MemberId } from 'src/modules/membership/domain/member/member-id';
import {
  PaymentStatus,
  PaymentStatusType,
} from './payment-status.value-object';
import { PaymentId } from './payment-id';
import { CreateOrderProps, Order } from './order/order.entity';
import { Amount, CreateAmountProps } from '../amount.value-object';

export interface PaymentProps<T> {
  method: T;
  memberId: MemberId;
  order: Order;
  amount: Amount;
  status: PaymentStatus;
  updatedAt: Date;
  createdAt: Date;
}
export type CreatePaymentProps = {
  memberId: MemberId;
  order: CreateOrderProps;
  amount: CreateAmountProps;
};

export abstract class Payment<
  T extends string = string,
  P extends PaymentProps<T> = PaymentProps<T>,
> extends AggregateRoot<P> {
  get id(): EntityId {
    return this._id;
  }

  get paymentId(): PaymentId {
    return new PaymentId(this.id.value);
  }

  get method(): T {
    return this.props.method;
  }

  get memberId(): MemberId {
    return this.props.memberId;
  }

  get order(): Order {
    return this.props.order;
  }

  get amount(): Amount {
    return this.props.amount;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public updateStatus(status: PaymentStatusType): void {
    this.props.status = PaymentStatus.create({ value: status });
  }

  protected constructor(props: P, id?: string) {
    super(props, id);
  }
}
