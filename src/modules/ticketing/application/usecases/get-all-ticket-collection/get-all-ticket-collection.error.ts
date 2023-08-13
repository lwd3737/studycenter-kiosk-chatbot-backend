/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors, DomainError, UseCaseError } from 'src/core';

export type GetAllTicketCollectionsError =
  | AppErrors.UnexpectedError
  | GetAllTicketCollectionsErrors.TicketNotExistError
  | DomainError;

export namespace GetAllTicketCollectionsErrors {
  export class TicketNotExistError extends UseCaseError {
    constructor() {
      super(`Ticket not found`);
    }
  }
}
