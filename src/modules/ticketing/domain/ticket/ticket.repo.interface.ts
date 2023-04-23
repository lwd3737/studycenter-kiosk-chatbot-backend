import { IRepo } from 'src/core/domain/repo.interface';
import { TicketCategory } from './ticket-category.value-object';
import { TicketTime } from './ticket-time.value-object';
import { Ticket } from './ticket.aggregate-root';

export const TicketRepoProvider = Symbol('TicketRepoProvider');

export interface ITicketRepo extends IRepo<Ticket> {
  isEmpty(): Promise<boolean>;
  getAllTickets(): Promise<Ticket[]>;
  getTicketsByCategory(category: TicketCategory): Promise<Ticket[]>;
  getTicketByTime(time: TicketTime): Promise<Ticket | null>;
  bulkCreate(tickets: Ticket[]): Promise<void>;
  clear(): Promise<void>;
}
