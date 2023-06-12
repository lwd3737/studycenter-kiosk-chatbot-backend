/* eslint-disable @typescript-eslint/no-namespace */

import { AppErrors, UseCaseError } from 'src/core';

export type GetTicketsByTypeError =
  | AppErrors.UnexpectedError
  | GetTicketsByTypeErrors.TicketNotFoundError;

export namespace GetTicketsByTypeErrors {
  export class TicketNotFoundError extends UseCaseError {
    constructor() {
      super(`Ticket not found`);
    }
  }
}
