import {
  AggregateRoot,
  DomainError,
  EntityId,
  Result,
  err,
  ok,
} from 'src/core';
import { MemberId } from 'src/modules/member/domain/member/member-id';
import {
  CreatePaymentStatusProps,
  PaymentStatus,
  PaymentStatusType,
} from './payment-status.value-object';
import { PaymentId } from './payment-id';
import { CreateOrderProps, Order } from './order/order.entity';
import {
  PaymentTotalAmount,
  CreateAmountProps,
} from '../total-amount.value-object';
import { OrderId } from './order/order-id';

export interface PaymentProps<Method> {
  method: Method;
  memberId: MemberId;
  order: Order;
  totalAmount: PaymentTotalAmount;
  status: PaymentStatus;
  secret: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export type CreatePaymentProps<Method> = {
  method: Method;
  memberId: string;
  order: CreateOrderProps & { id: OrderId };
  totalAmount: CreateAmountProps;
  status: CreatePaymentStatusProps;
  secret: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class Payment<
  Method,
  Props extends PaymentProps<Method>,
> extends AggregateRoot<Props> {
  public static createProps<Method>(
    props: CreatePaymentProps<Method>,
  ): Result<PaymentProps<Method>, DomainError> {
    const totalAmountOrError = PaymentTotalAmount.create(props.totalAmount);
    if (totalAmountOrError.isErr()) return err(totalAmountOrError.error);

    return ok({
      ...props,
      memberId: new MemberId(props.memberId),
      order: Order.create(props.order, props.order.id.value),
      totalAmount: totalAmountOrError.value,
      status: PaymentStatus.create({ value: props.status }),
    });
  }

  protected constructor(props: Props, id?: string) {
    super(props, id);
  }

  get id(): EntityId {
    return this._id;
  }

  get paymentId(): PaymentId {
    return new PaymentId(this.id.value);
  }

  get method(): Method {
    return this.props.method;
  }

  get memberId(): MemberId {
    return this.props.memberId;
  }

  get order(): Order {
    return this.props.order;
  }

  get totalAmount(): PaymentTotalAmount {
    return this.props.totalAmount;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  public updateStatus(status: PaymentStatusType): void {
    this.props.status = PaymentStatus.create({ value: status });
  }

  get secret(): string | null {
    return this.props.secret;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
