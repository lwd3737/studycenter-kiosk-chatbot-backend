import { DomainError } from 'src/core';

export type TicketDiscountError = PriceInvalidError;

class PriceInvalidError extends DomainError {
  constructor(price: number) {
    super(
      `The discount price "${price}" is invalid. The discount price must be a positive integer.`,
    );
  }
}

export const TicketDiscountErrors = {
  PriceInvalidError,
};
