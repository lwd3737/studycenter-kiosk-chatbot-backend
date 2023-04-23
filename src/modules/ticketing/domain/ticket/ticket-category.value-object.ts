import { ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/core';
import { TicketErrors } from './ticket.error';

export interface TicketCategoryProps {
  value: TicketCategoryEnum;
}

export enum TicketCategoryEnum {
  PERIOD = 'PERIOD',
  HOURS_RECHARGE = 'HOURS_RECHARGE',
  SAME_DAY = 'SAME_DAY',
}

export class TicketCategory extends ValueObject<TicketCategoryProps> {
  get value(): TicketCategoryEnum {
    return this.props.value;
  }

  get label(): string {
    switch (this.value) {
      case TicketCategoryEnum.PERIOD:
        return '정기권';
      case TicketCategoryEnum.HOURS_RECHARGE:
        return '시간권';
      case TicketCategoryEnum.SAME_DAY:
        return '당일권';
    }
  }

  private constructor(props: TicketCategoryProps) {
    super(props);
  }

  static create(props: {
    value: string;
  }): Result<TicketCategory, TicketErrors.CategoryInvalidTypeError> {
    if (this.isValidCategory(props.value) === false) {
      return err(new TicketErrors.CategoryInvalidTypeError(props.value));
    }

    return ok(new TicketCategory({ value: props.value as TicketCategoryEnum }));
  }

  private static isValidCategory(category: string): boolean {
    return Object.values<string>(TicketCategoryEnum).includes(
      category.toUpperCase(),
    );
  }
}
