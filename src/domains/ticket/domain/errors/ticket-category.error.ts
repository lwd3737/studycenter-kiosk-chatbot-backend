/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type TicketCategoryError = TicketCategoryErrors.InvalidValueError;

export namespace TicketCategoryErrors {
  export class InvalidValueError extends DomainError {
    constructor(category: string) {
      super(
        `The category "${category}" is invalid. The category must be one of "PERIOD", "HOURS_RECHARGE", "SAME_DAY".`,
      );
    }
  }
}
