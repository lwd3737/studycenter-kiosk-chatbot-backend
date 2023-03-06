import { ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/shared/utils';
import { InvalidTicketDiscountPriceError } from './ticket-errors';

export interface TicketDiscountVOProps {
  type: string;
  price: number;
}

export class TicketDiscountVO extends ValueObject<TicketDiscountVOProps> {
  private constructor(props: TicketDiscountVOProps) {
    super(props);
  }

  public static create(
    props: TicketDiscountVOProps,
  ): Result<TicketDiscountVO, InvalidTicketDiscountPriceError> {
    if (this.isInvalidPrice(props.price)) {
      return err(new InvalidTicketDiscountPriceError(props.price));
    }

    return ok(new TicketDiscountVO(props));
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
