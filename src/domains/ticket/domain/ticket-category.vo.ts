import { ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/shared/utils';
import { InvalidTicketCategoryError } from './ticket-errors';

export interface TicketCategoryVOProps {
  value: TicketCategory;
}

export enum TicketCategory {
  PERIOD = 'PERIOD',
  HOURS_RECHARGE = 'HOURS_RECHARGE',
  SAME_DAY = 'SAME_DAY',
}

export class TicketCategoryVO extends ValueObject<TicketCategoryVOProps> {
  private constructor(props: TicketCategoryVOProps) {
    super(props);
  }

  static create(
    category: string,
  ): Result<TicketCategoryVO, InvalidTicketCategoryError> {
    if (this.isValidCategory(category) === false) {
      return err(new InvalidTicketCategoryError(category));
    }

    return ok(new TicketCategoryVO({ value: category as TicketCategory }));
  }

  private static isValidCategory(category: string): boolean {
    return (Object.values(TicketCategory) as string[]).includes(category);
  }

  get value(): TicketCategory {
    return this.props.value;
  }
}
