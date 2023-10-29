import { AppError, DomainError, UnknownError } from 'src/core';

export type GetAvailableMyTicketsError =
  | DomainError
  | UnknownError
  | AlreadyInUseMyTicketError;

const ERROR_PREFIX = 'GET_AVAILABLE_MY_TICKETS';

export class AlreadyInUseMyTicketError extends AppError {
  constructor() {
    super(`[${ERROR_PREFIX}]: Already in use my ticket`);
  }
}
