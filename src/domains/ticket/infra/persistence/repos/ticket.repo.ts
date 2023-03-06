import {
  ITicketRepo,
  Ticket,
  TicketQueryFilter,
} from 'src/domains/ticket/domain';

export class TicketRepo implements ITicketRepo {
  getAllTickets(filter?: TicketQueryFilter | undefined): Promise<Ticket[]> {
    throw new Error('Method not implemented.');
  }
  bulkCreate(tickets: Ticket[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  clear(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
