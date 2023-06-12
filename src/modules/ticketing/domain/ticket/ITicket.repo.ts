import { IRepo } from 'src/core/domain/repo.interface';
import { Ticket } from './ticket.aggregate-root';
import { TicketTime } from './time.value-object';
import { TicketType } from './type.value-object';

export const TicketRepoProvider = Symbol('TicketRepoProvider');

export interface ITicketRepo extends IRepo<Ticket> {
  isEmpty(): Promise<boolean>;
  getAllTickets(): Promise<Ticket[]>;
  getTicketsByType(type: TicketType): Promise<Ticket[]>;
  getTicketByTime(time: TicketTime): Promise<Ticket | null>;
  bulkCreate(tickets: Ticket[]): Promise<void>;
  clear(): Promise<void>;
}
