import { IRepo } from 'src/core/domain/repo.interface';
import { Ticket } from './ticket.ar';
import { TicketId } from './ticket-id';
import { TicketType } from '../ticket-factory';
import { TicketUsageDuration } from './usage-duration.vo';

export const TicketRepoProvider = Symbol('TicketRepoProvider');

export interface ITicketRepo extends IRepo<Ticket> {
  isEmpty(): Promise<boolean>;
  findAll(): Promise<Ticket[]>;
  findByType(type: TicketType): Promise<Ticket[]>;
  findOneById(id: TicketId): Promise<Ticket | null>;
  findOneByUsageTime(time: TicketUsageDuration): Promise<Ticket | null>;
  bulkCreate(tickets: Ticket[]): Promise<void>;
  clear(): Promise<void>;
}
