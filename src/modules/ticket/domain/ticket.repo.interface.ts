import { IRepo } from 'src/core/domain/repo.interface';
import { TicketCategory } from './ticket-category.value-object';
import { Ticket } from './ticket.aggregate-root';

export const TicketRepoProvider = Symbol('TicketRepoProvider');

export interface ITicketRepo extends IRepo<Ticket> {
  getAllTickets(): Promise<Ticket[]>;
  getTicketsByCategory(category: TicketCategory): Promise<Ticket[]>;
  bulkCreate(tickets: Ticket[]): Promise<void>;
  clear(): Promise<void>;
}
