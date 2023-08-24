import { AppError } from 'src/core';

export type IssueVirtualAccountError =
  | MemberNotFoundError
  | TicketNotFoundError;

export class MemberNotFoundError extends AppError<{
  appUserId: string;
}> {
  constructor(appUserId: string) {
    super(`Member with appUserId(${appUserId}) not found`, { appUserId });
  }
}

export class TicketNotFoundError extends AppError<{
  ticketId: string;
}> {
  constructor(ticketId: string) {
    super(`Ticket with ticketId(${ticketId}) not found`, { ticketId });
  }
}
