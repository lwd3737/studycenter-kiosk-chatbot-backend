/* eslint-disable @typescript-eslint/no-namespace */
import { AppError, DomainError, UseCaseError } from 'src/core';

export type GetAllTicketCollectionsError =
  | AppError
  | GetAllTicketCollectionsErrors.TicketNotExistError
  | DomainError;

export namespace GetAllTicketCollectionsErrors {
  export class TicketNotExistError extends UseCaseError {
    constructor() {
      super(`Ticket not found`);
    }
  }
}
