import { AppError } from 'src/core';

export class TicketNotFoundError extends AppError<{
  ticketId: string;
}> {
  constructor(id: string) {
    super(`Ticket with id(${id}) not found`, { ticketId: id });
  }
}
