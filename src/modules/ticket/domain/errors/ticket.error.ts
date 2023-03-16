/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type TicketError =
  | TicketErrors.CategoryInvalidTypeError
  | TicketErrors.CategoryAndTimeUnitMismatchedError
  | TicketErrors.PriceInvalidError
  | TicketErrors.TimeUnitInvalidError
  | TicketErrors.TimeValueInvalidError
  | TicketErrors.DiscountPriceInvalidError;

export namespace TicketErrors {
  export class CategoryInvalidTypeError extends DomainError {
    constructor(category: string) {
      super(
        `The category "${category}" is invalid. The category must be one of "PERIOD", "HOURS_RECHARGE", "SAME_DAY".`,
      );
    }
  }
  export class CategoryAndTimeUnitMismatchedError extends DomainError {
    constructor(props: { category: string; timeUnit: string }) {
      super(
        `The category "${props.category}" does not match the tume unit "${props.timeUnit}"`,
      );
    }
  }

  export class PriceInvalidError extends DomainError {
    constructor(price: number) {
      super(
        `The price "${price}" is invalid. The price must be a positive integer.`,
      );
    }
  }

  export class TimeUnitInvalidError extends DomainError {
    constructor(timeUnit: string) {
      super(
        `The time unit "${timeUnit}" is invalid. The time unit must be one of "DAYS", "HOURS".`,
      );
    }
  }

  export class TimeValueInvalidError extends DomainError {
    constructor(timeValue: number) {
      super(
        `The time value "${timeValue}" is invalid. The time value must be a positive integer.`,
      );
    }
  }

  export class DiscountPriceInvalidError extends DomainError {
    constructor(price: number) {
      super(
        `The discount price "${price}" is invalid. The discount price must be a positive integer.`,
      );
    }
  }
}
