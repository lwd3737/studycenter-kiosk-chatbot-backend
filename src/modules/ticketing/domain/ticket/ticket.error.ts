/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type TicketError =
  | TicketErrors.PriceNotInteger
  | TicketErrors.PriceNotPositive
  | TicketErrors.InvalidTimeValue;

export namespace TicketErrors {
  export class PriceNotInteger extends DomainError {
    constructor() {
      super(`Ticket price not integer`);
    }
  }

  export class PriceNotPositive extends DomainError {
    constructor() {
      super(`Ticket price must be positive integer`);
    }
  }

  export class InvalidTimeValue extends DomainError {
    constructor(timeValue: number) {
      super(
        `The time value "${timeValue}" is invalid. The time value must be a positive integer.`,
      );
    }
  }

  export class InvalidTimeUnit extends DomainError {
    constructor(timeUnit: string) {
      super(
        `The time unit "${timeUnit}" is invalid. The time unit must be either "days" or "hours".`,
      );
    }
  }
}
