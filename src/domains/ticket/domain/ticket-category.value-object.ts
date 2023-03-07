import { ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/core';
import { TicketCategoryError, TicketCategoryErrors } from './errors';

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

  static create(value: string): Result<TicketCategory, TicketCategoryError> {
    if (this.isValidCategory(value) === false) {
      return err(new TicketCategoryErrors.InvalidValueError(value));
    }

    return ok(new TicketCategory({ value: value as TicketCategoryEnum }));
  }

  private static isValidCategory(category: string): boolean {
    return (Object.values(TicketCategoryEnum) as string[]).includes(category);
  }
}
