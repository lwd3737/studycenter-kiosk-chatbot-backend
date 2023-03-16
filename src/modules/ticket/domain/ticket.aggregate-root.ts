import { AggregateRoot } from 'src/core/domain/aggregate-root';
import { err, ok, Result } from 'src/core';
import { TicketDiscount } from './ticket-discount.value-object';
import { TTicketTimeUnit, TicketTime } from './ticket-time.value-object';
import {
  TicketCategory,
  TicketCategoryEnum,
} from './ticket-category.value-object';
import { TicketError, TicketErrors } from './errors/ticket.error';

export interface TicketProps {
  title: string;
  category: TicketCategory;
  time: TicketTime;
  price: number;
  discount?: TicketDiscount;
}

export class Ticket extends AggregateRoot<TicketProps> {
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

  static create(props: TicketProps, id?: string): Result<Ticket, TicketError> {
    if (this.isCategoryAndTimeUnitMatched(props) === false) {
      return err(
        new TicketErrors.CategoryAndTimeUnitMismatchedError({
          category: props.category.value,
          timeUnit: props.time.unit,
        }),
      );
    }

    return ok(new Ticket(props, id));
  }

  private static isCategoryAndTimeUnitMatched(props: TicketProps): boolean {
    const { category, time } = props;

    switch (category.value) {
      case TicketCategoryEnum.PERIOD:
        if (time.unit !== TTicketTimeUnit.DAYS) {
          return false;
        }
        break;
      case TicketCategoryEnum.HOURS_RECHARGE:
        if (time.unit !== TTicketTimeUnit.HOURS) {
          return false;
        }
        break;
      case TicketCategoryEnum.SAME_DAY:
        if (time.unit !== TTicketTimeUnit.HOURS) {
          return false;
        }
        break;
    }

    return true;
  }
}
