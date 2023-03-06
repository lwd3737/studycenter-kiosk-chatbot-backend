import { AggregateRoot } from 'src/core/domain/aggregate-root';
import { err, ok, Result } from 'src/shared/utils';
import { MismatchedTicketCategoryAndTimeUnitError } from './ticket-errors';
import { TicketCategory, TicketCategoryVO } from './ticket-category.vo';
import { TicketDiscountVO } from './ticket-discount.vo';
import { TicketTimeUnit, TicketTimeVO } from './ticket-time.vo';

export interface TicketEntityProps {
  name: string;
  category: TicketCategoryVO;
  time: TicketTimeVO;
  price: number;
  discount?: TicketDiscountVO;
}

export class TicketEntity extends AggregateRoot<TicketEntityProps> {
  private constructor(props: TicketEntityProps, id?: string) {
    super(props, id);
  }

  static create(
    props: TicketEntityProps,
    id?: string,
  ): Result<TicketEntity, MismatchedTicketCategoryAndTimeUnitError> {
    if (this.isCategoryAndTimeUnitMatched(props) === false) {
      return err(
        new MismatchedTicketCategoryAndTimeUnitError({
          category: props.category.value,
          timeUnit: props.time.unit,
        }),
      );
    }

    return ok(new TicketEntity(props, id));
  }

  private static isCategoryAndTimeUnitMatched(
    props: TicketEntityProps,
  ): boolean {
    const { category, time } = props;

    switch (category.value) {
      case TicketCategory.PERIOD:
        if (time.unit !== TicketTimeUnit.DAYS) {
          return false;
        }
        break;
      case TicketCategory.HOURS_RECHARGE:
        if (time.unit !== TicketTimeUnit.HOURS) {
          return false;
        }
        break;
      case TicketCategory.SAME_DAY:
        if (time.unit !== TicketTimeUnit.HOURS) {
          false;
        }
        break;
    }

    return true;
  }
}
