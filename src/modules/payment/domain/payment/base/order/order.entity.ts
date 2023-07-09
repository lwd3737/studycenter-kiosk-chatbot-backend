import { Entity, EntityId } from 'src/core';
import { OrderId } from './order-id';
import { TicketId } from 'src/modules/ticketing';

interface Props {
  ticketId: TicketId;
  name: string;
}

export type CreateOrderProps = Props;

export class Order extends Entity<Props> {
  get id(): EntityId {
    return this._id;
  }

  get orderId(): OrderId {
    return new OrderId(this.id.value);
  }

  get ticketId(): TicketId {
    return this.props.ticketId;
  }

  get name(): string {
    return this.props.name;
  }

  public static create(props: CreateOrderProps, id?: string) {
    return new Order(props, id);
  }

  private constructor(props: Props, id?: string) {
    super(props, id);
  }
}
