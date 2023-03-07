/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type TicketDiscountError = TicketDiscountErrors.PriceInvalidError;
export namespace TicketDiscountErrors {
  export class PriceInvalidError extends DomainError {
    constructor(price: number) {
      super(
        `The discount price "${price}" is invalid. The discount price must be a positive integer.`,
      );
    }
  }
}
