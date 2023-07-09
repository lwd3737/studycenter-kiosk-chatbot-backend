import { AggregateRoot } from 'src/core/domain/aggregate-root';
import { TicketTime, TicketTimeProps } from './time.value-object';
import { TicketId } from './ticket-id';
import { TicketPriceProps, TicketPrice } from './price.value-object';
import {
  TicketExpirationTypeProps,
  TicketExpirationType,
} from './expiration-type.value-object';
import { TicketType } from './type.value-object';
import { DomainError, Result, combine, ok } from 'src/core';

export interface TicketProps<T> {
  title: string;
  type: T;
  isFixedSeat: boolean;
  time: TicketTime;
  price: TicketPrice;
  expirationType: TicketExpirationType;
}
export type OldNewTicketProps = {
  title: string;
  time: TicketTimeProps;
  price: TicketPriceProps;
};
export type CreateTicketProps<T> = Pick<
  TicketProps<T>,
  'title' | 'type' | 'isFixedSeat'
> & {
  time: TicketTimeProps;
  price: TicketPriceProps;
  expirationType: TicketExpirationTypeProps;
};

export class Ticket<
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

  get expirationType(): TicketExpirationType {
    return this.props.expirationType;
  }

  protected static create<T extends TicketType>(
    props: CreateTicketProps<T>,
    id?: string,
  ): Result<Ticket, DomainError> {
    const propsOrError = combine(
      TicketTime.create({ ...props.time }),
      TicketPrice.create({ ...props.price }),
    );
    if (propsOrError.isErr()) return propsOrError;
    const [time, price] = propsOrError.value;

    return ok(
      new Ticket(
        {
          ...props,
          time,
          expirationType: TicketExpirationType.create(props.expirationType),
          price,
        },
        id,
      ),
    );
  }

  protected constructor(props: P, id?: string) {
    super(props, id);
  }
}
