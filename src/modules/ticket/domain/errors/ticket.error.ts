/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type TicketError = TicketErrors.CategoryAndTimeUnitMismatchedError;

export namespace TicketErrors {
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
}
