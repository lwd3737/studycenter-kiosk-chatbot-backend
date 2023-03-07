/* eslint-disable @typescript-eslint/no-namespace */
import { AppError, DomainError, UseCaseError } from 'src/core';

export type GetAllTicketCollectionsError =
  | AppError
  | GetAllTicketCollectionsErrors.TicketNotFoundError
  | DomainError;

export namespace GetAllTicketCollectionsErrors {
  export class TicketNotFoundError extends UseCaseError {
    constructor() {
      super(`Ticket not found`);
    }
  }
}
