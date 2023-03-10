/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type TicketTimeError =
  | TicketTimeErrors.UnitInvalidError
  | TicketTimeErrors.ValueInvalidError;

export namespace TicketTimeErrors {
  export class UnitInvalidError extends DomainError {
    constructor(timeUnit: string) {
      super(
        `The time unit "${timeUnit}" is invalid. The time unit must be one of "DAYS", "HOURS".`,
      );
    }
  }

  export class ValueInvalidError extends DomainError {
    constructor(timeValue: number) {
      super(
        `The time value "${timeValue}" is invalid. The time value must be a positive integer.`,
      );
    }
  }
}
