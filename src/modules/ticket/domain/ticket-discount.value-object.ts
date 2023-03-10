import { ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/core';
import { TicketDiscountError, TicketDiscountErrors } from './errors';

export interface TicketDiscountProps {
  type: string;
  price: number;
}

export class TicketDiscount extends ValueObject<TicketDiscountProps> {
  private constructor(props: TicketDiscountProps) {
    super(props);
  }

  public static create(
    props: TicketDiscountProps,
  ): Result<TicketDiscount, TicketDiscountError> {
    if (this.isInvalidPrice(props.price)) {
      return err(new TicketDiscountErrors.PriceInvalidError(props.price));
    }

    return ok(new TicketDiscount(props));
  }

  private static isInvalidPrice(price: number): boolean {
    if (price < 0) {
      return false;
    }

    if (Number.isInteger(price) === false) {
      return false;
    }

    return true;
  }
}
