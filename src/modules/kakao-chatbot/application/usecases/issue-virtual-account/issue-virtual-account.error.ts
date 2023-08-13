import { ApplicationError } from 'src/core';

export type IssueVirtualAccountError =
  | MemberNotFoundError
  | TicketNotFoundError
  | SimpleTextCreationFailedError;

export class MemberNotFoundError extends ApplicationError {
  constructor(appUserId: string) {
    super(`Member with appUserId(${appUserId}) not found`);
  }
}

export class TicketNotFoundError extends ApplicationError {
  constructor(ticketId: string) {
    super(`Ticket with ticketId(${ticketId}) not found`);
  }
}

export class SimpleTextCreationFailedError extends ApplicationError {
  constructor(detailMessage: string) {
    super(`SimpleText creation failed: ${detailMessage}`);
  }
}
