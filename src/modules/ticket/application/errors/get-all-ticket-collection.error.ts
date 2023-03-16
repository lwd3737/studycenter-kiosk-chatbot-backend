/* eslint-disable @typescript-eslint/no-namespace */
import { AppError, UseCaseError } from 'src/core';
import { TicketError } from '../../domain/errors/ticket.error';

export type GetAllTicketCollectionsError =
  | AppError
  | GetAllTicketCollectionsErrors.TicketNotFoundError
  | TicketError;

export namespace GetAllTicketCollectionsErrors {
  export class TicketNotFoundError extends UseCaseError {
    constructor() {
      super(`Ticket not found`);
    }
  }
}
