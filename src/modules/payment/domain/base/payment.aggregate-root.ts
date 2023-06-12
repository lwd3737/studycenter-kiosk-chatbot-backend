import { AggregateRoot, EntityId } from 'src/core';
import { MemberId } from 'src/modules/membership/domain/member/member-id';
import { CreatePGInfoProps, PGInfo } from './pg-info.value-object';
import { CreateOrderProps, Order } from './order.entity';
import { Amount, CreateAmountProps } from './amount.value-object';
import {
  CreatePaymentStatusProps,
  PaymentStatus,
} from './payment-status.value-object';
import { PaymentId } from './payment-id';

export interface PaymentProps {
  method: string;
  pg: PGInfo;
  memberId: MemberId;
  order: Order;
  amount: Amount;
  status: PaymentStatus;
  updatedAt: Date;
  createdAt: Date;
}

export type CreatePaymentProps = {
  method: string;
  pg: CreatePGInfoProps;
  memberId: MemberId;
  order: CreateOrderProps;
  amount: CreateAmountProps;
  status: CreatePaymentStatusProps;
  updatedAt: Date;
  createdAt: Date;
};

export abstract class Payment<P extends PaymentProps> extends AggregateRoot<P> {
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

  protected constructor(props: P, id?: string) {
    super(props, id);
  }
}
