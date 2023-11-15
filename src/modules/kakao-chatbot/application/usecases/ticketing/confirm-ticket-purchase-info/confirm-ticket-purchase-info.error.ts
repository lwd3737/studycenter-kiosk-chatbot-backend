import { AppError, DomainError, UnknownError } from 'src/core';

export type SelectSeatAndConfirmTicketPurchaseInfoError =
  | DomainError
  | UnknownError
  | TicketNotSelectedError
  | TicketNotFoundError;

export class TicketNotSelectedError extends AppError {
  constructor(appUserId: string) {
    super(`Ticket not selected for appUserId(${appUserId})`, { appUserId });
  }
}

export class TicketNotFoundError extends AppError {
  constructor(ticketId: string) {
    super(`Ticket with ticketId(${ticketId}) not found`, { ticketId });
  }
}
