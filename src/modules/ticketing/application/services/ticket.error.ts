import { ApplicationError } from 'src/core';

export class TicketNotFoundError extends ApplicationError<{
  ticketId: string;
}> {
  constructor(id: string) {
    super(`Ticket with id(${id}) not found`, { ticketId: id });
  }
}
