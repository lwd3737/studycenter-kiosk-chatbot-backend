import { AggregateRoot } from 'src/core/domain/aggregate-root';
import { TicketId } from './ticket-id';
import { TicketPrice } from './price.value-object';

import { DomainError, Result, combine, err, ok } from 'src/core';
import {
  CreateTicketUsageDurationProps,
  TicketUsageDuration,
} from './usage-duration.vo';

export interface TicketProps {
  title: string;
  type: string;
  fixedSeat: boolean;
  usageDuration: TicketUsageDuration;
  price: TicketPrice;
}

export type CreateTicketProps = Pick<
  TicketProps,
  'title' | 'type' | 'fixedSeat'
> & {
  usageDuration: CreateTicketUsageDurationProps;
  price: number;
};

export abstract class Ticket<
  Props extends TicketProps = TicketProps,
> extends AggregateRoot<Props> {
  protected static createProps(
    props: CreateTicketProps,
  ): Result<TicketProps, DomainError> {
    const propsOrError = combine(
      TicketPrice.create({ value: props.price }),
      TicketUsageDuration.create(props.usageDuration),
    );
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [price, usageDuration] = propsOrError.value;

    return ok({
      ...props,
      price,
      usageDuration,
    });
  }

  protected constructor(props: Props, id?: string) {
    super(props, id);
  }

  get ticketId(): TicketId {
    return new TicketId(this._id.value);
  }

  get type(): string {
    return this.props.type;
  }

  abstract get typeDisplay(): string;

  get title(): string {
    return this.props.title;
  }

  abstract get fullTitle(): string;

  get fixedSeat(): boolean {
    return this.props.fixedSeat;
  }

  get usageDuration(): TicketUsageDuration {
    return this.props.usageDuration;
  }

  get price(): TicketPrice {
    return this.props.price;
  }
}
