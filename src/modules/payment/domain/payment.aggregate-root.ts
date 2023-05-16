import {
  AggregateRoot,
  DomainError,
  EntityId,
  Result,
  combine,
  err,
  ok,
} from 'src/core';
import { MemberId } from 'src/modules/membership/domain/member/member-id';
import { CreatePGInfoProps, PGInfo } from './pg-info.value-object';
import { CreateOrderProps, Order } from './order.entity';
import { Amount, CreateAmountProps } from './amount.value-object';
import {
  CreatePaymentStatusProps,
  PaymentStatus,
} from './payment-status.value-object';
import {
  CreatePaymentMethodProps,
  PaymentMethod,
  PaymentMethodFactory,
  PaymentMethodType,
} from './payment-methods/payment-method.factory';
import { PaymentId } from './payment-id';

interface Props {
  pg: PGInfo;
  memberId: MemberId;
  order: Order;
  amount: Amount;
  method: PaymentMethod;
  status: PaymentStatus;
  updatedAt: Date;
  createdAt: Date;
}

type CreateProps = {
  pg: CreatePGInfoProps;
  memberId: MemberId;
  order: CreateOrderProps;
  amount: CreateAmountProps;
  method: { type: PaymentMethodType; props: CreatePaymentMethodProps };
  status: CreatePaymentStatusProps;
  updatedAt: Date;
  createdAt: Date;
};

export class Payment extends AggregateRoot<Props> {
  get id(): EntityId {
    return this._id;
  }

  get paymentId(): PaymentId {
    return new PaymentId(this.id.value);
  }

  get pg(): PGInfo {
    return this.props.pg;
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

  public static create(
    props: CreateProps,
    id?: string,
  ): Result<Payment, DomainError> {
    const propsOrError = combine(
      Amount.create(props.amount),
      PaymentMethodFactory.create(props.method.type, props.method.props),
    );
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [amount, paymentMethod] = propsOrError.value;

    return ok(
      new Payment(
        {
          pg: PGInfo.create(props.pg),
          memberId: props.memberId,
          order: Order.create(props.order),
          status: PaymentStatus.create(props.status),
          amount,
          method: paymentMethod,
          updatedAt: props.updatedAt ?? new Date(),
          createdAt: props.createdAt ?? new Date(),
        },
        id,
      ),
    );
  }

  private constructor(props: Props, id?: string) {
    super(props, id);
  }
}
