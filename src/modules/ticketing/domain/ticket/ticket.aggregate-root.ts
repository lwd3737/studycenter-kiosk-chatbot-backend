import { AggregateRoot } from 'src/core/domain/aggregate-root';
import { TicketTime, CreateTicketTimeProps } from './time.value-object';
import { TicketId } from './ticket-id';
import { CreateTicketPriceProps, TicketPrice } from './price.value-object';
import { TicketExpiration } from './expiration.value-object';
import { CreateTicketExpirationProps } from './expiration.value-object';
import { TicketType } from './type.value-object';

export interface TicketProps<T> {
  title: string;
  type: T;
  isFixedSeat: boolean;
  time: TicketTime;
  price: TicketPrice;
  expiration: TicketExpiration;
}
export type CreateNewTicketProps = {
  title: string;
  time: CreateTicketTimeProps;
  price: CreateTicketPriceProps;
};
export type CreateTicketFromExisting<T> = {
  title: string;
  type: T;
  isFixedSeat: boolean;
  time: CreateTicketTimeProps;
  price: CreateTicketPriceProps;
  expiration: CreateTicketExpirationProps;
};

export abstract class Ticket<
  T extends TicketType = TicketType,
  P extends TicketProps<T> = TicketProps<T>,
> extends AggregateRoot<P> {
  get ticketId(): TicketId {
    return new TicketId(this._id.value);
  }

  get type(): T {
    return this.props.type;
  }

  get title(): string {
    return this.props.title;
  }

  get isFixedSeat(): boolean {
    return this.props.isFixedSeat;
  }

  get time(): TicketTime {
    return this.props.time;
  }

  get price(): TicketPrice {
    return this.props.price;
  }

  get expiration(): TicketExpiration {
    return this.props.expiration;
  }

  // abstract setExpiration():

  protected constructor(props: P, id?: string) {
    super(props, id);
  }
}
