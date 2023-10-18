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

  export class InvalidUsageDurationUnit extends DomainError {
    constructor(unit: string) {
      super(`[TicketUsageDuration]: usage duration unit "${unit}" is invalid`);
    }
  }
}
