import { DomainError } from 'src/core';

export type TicketPriceError = PriceInvalidError;

class PriceInvalidError extends DomainError {
  constructor(price: number) {
    super(
      `The price "${price}" is invalid. The price must be a positive integer.`,
    );
  }
}

export const TicketPriceErrors = {
  PriceInvalidError,
};
