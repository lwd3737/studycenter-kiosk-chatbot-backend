import { Entity, EntityId } from 'src/core';
import { OrderId } from './order-id';
import { TicketId } from 'src/modules/ticketing';

interface Props {
  name: string;
  orderItem: OrderItem;
}

type OrderItem = {
  ticketId: TicketId;
};

export type CreateOrderProps = Props;

export class Order extends Entity<Props> {
  get id(): EntityId {
    return this._id;
  }

  get orderId(): OrderId {
    return new OrderId(this.id.value);
  }

  get name(): string {
    return this.props.name;
  }

  get orderItem(): OrderItem {
    return this.props.orderItem;
  }

  public static create(props: Props, id?: string) {
    return new Order(props, id);
  }

  private constructor(props: Props, id?: string) {
    super(props, id);
  }
}
