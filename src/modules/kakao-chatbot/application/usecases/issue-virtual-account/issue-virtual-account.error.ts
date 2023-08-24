import { AppError } from 'src/core';

export type IssueVirtualAccountError =
  | MemberNotFoundError
  | TicketNotFoundError
  | SimpleTextCreationFailedError;

export class MemberNotFoundError extends AppError {
  constructor(appUserId: string) {
    super(`Member with appUserId(${appUserId}) not found`);
  }
}

export class TicketNotFoundError extends AppError {
  constructor(ticketId: string) {
    super(`Ticket with ticketId(${ticketId}) not found`);
  }
}

export class SimpleTextCreationFailedError extends AppError {
  constructor(detailMessage: string) {
    super(`SimpleText creation failed: ${detailMessage}`);
  }
}
