import { AggregateRoot } from 'src/core/domain/aggregate-root';
import { combine, err, ok, Result } from 'src/core';
import { TicketTimeUnitEnum, TicketTime } from './ticket-time.value-object';
import {
  TicketCategory,
  TicketCategoryEnum,
} from './ticket-category.value-object';
import { TicketId } from './ticket-id';
import { TicketError, TicketErrors } from './ticket.error';

export interface TicketProps {
  title: string;
  category: TicketCategory;
  time: TicketTime;
  price: number;
  //discount?: TicketDiscount;
}

export type CreateProps = {
  title: string;
  category: string;
  time: { unit: string; value: number };
  price: number;
  //discount?: { type: string; price: number };
};

export class Ticket extends AggregateRoot<TicketProps> {
  get ticketId(): TicketId {
    return new TicketId(this._id.value);
  }

  get title(): string {
    return this.props.title;
  }

  get category(): TicketCategory {
    return this.props.category;
  }

  get time(): TicketTime {
    return this.props.time;
  }

  get price(): number {
    return this.props.price;
  }

  private constructor(props: TicketProps, id?: string) {
    super(props, id);
  }

  static create(props: CreateProps, id?: string): Result<Ticket, TicketError> {
    const propsOrError = combine(
      TicketCategory.create({ value: props.category }),
      TicketTime.create(props.time),
    );
    if (propsOrError.isErr()) {
      return err(propsOrError.error);
    }
    const [category, time] = propsOrError.value;

    if (this.isCategoryAndTimeUnitMatched({ category, time }) === false) {
      return err(
        new TicketErrors.CategoryAndTimeUnitMismatchedError({
          category: category.value,
          timeUnit: time.unit,
        }),
      );
    }

    return ok(new Ticket({ ...props, category, time }, id));
  }

  private static isCategoryAndTimeUnitMatched(
    props: Pick<TicketProps, 'category' | 'time'>,
  ): boolean {
    switch (props.category.value) {
      case TicketCategoryEnum.PERIOD:
        if (props.time.unit !== TicketTimeUnitEnum.DAYS) {
          return false;
        }
        break;
      case TicketCategoryEnum.HOURS_RECHARGE:
        if (props.time.unit !== TicketTimeUnitEnum.HOURS) {
          return false;
        }
        break;
      case TicketCategoryEnum.SAME_DAY:
        if (props.time.unit !== TicketTimeUnitEnum.HOURS) {
          return false;
        }
        break;
    }

    return true;
  }
}
