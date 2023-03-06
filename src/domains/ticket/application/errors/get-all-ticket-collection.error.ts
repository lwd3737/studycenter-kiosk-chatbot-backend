import { AppError, DomainError, UseCaseError } from 'src/core';

export class TicketNotFoundError extends UseCaseError {
  constructor() {
    super(`Ticket not found`);
  }
}

export type GetAllTicketCollectionsError =
  | AppError
  | TicketNotFoundError
  | DomainError;
