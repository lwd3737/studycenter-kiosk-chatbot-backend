import { UseCaseError } from 'src/core';

export class TicketNotFoundError extends UseCaseError {
  constructor() {
    super('Ticket not found');
  }
}
