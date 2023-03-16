/* eslint-disable @typescript-eslint/no-namespace */

import { AppErrors, UseCaseError } from 'src/core';

export type GetTicketsByCategoryError =
  | AppErrors.UnexpectedError
  | GetTicketsByCategoryErrors.TicketNotFoundError;

export namespace GetTicketsByCategoryErrors {
  export class TicketNotFoundError extends UseCaseError {
    constructor() {
      super(`Ticket not found`);
    }
  }
}
