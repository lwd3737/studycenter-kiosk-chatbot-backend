import { IRepo } from 'src/core/domain/repo.interface';
import { Ticket } from './ticket.aggregate-root';

export const TicketRepoProvider = Symbol('TicketRepoProvider');

export type TicketQueryFilter = {
  category: string;
};
export interface ITicketRepo extends IRepo<Ticket> {
  getAllTickets(): Promise<Ticket[]>;
  bulkCreate(tickets: Ticket[]): Promise<void>;
  clear(): Promise<void>;
}
