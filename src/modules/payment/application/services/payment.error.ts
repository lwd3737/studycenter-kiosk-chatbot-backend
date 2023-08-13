import { ApplicationError } from 'src/core';

export type IssueVirtualAccountError =
  | MemberNotFoundError
  | TicketNotFoundError;

export class MemberNotFoundError extends ApplicationError<{
  appUserId: string;
}> {
  constructor(appUserId: string) {
    super(`Member with appUserId(${appUserId}) not found`, { appUserId });
  }
}

export class TicketNotFoundError extends ApplicationError<{
  ticketId: string;
}> {
  constructor(ticketId: string) {
    super(`Ticket with ticketId(${ticketId}) not found`, { ticketId });
  }
}
