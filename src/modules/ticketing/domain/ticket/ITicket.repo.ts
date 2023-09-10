import { IRepo } from 'src/core/domain/repo.interface';
import { Ticket } from './ticket.aggregate-root';
import { TicketTime } from './time.value-object';
import { TicketType } from './type.value-object';
import { TicketId } from './ticket-id';

export const TicketRepoProvider = Symbol('TicketRepoProvider');

export interface ITicketRepo extends IRepo<Ticket> {
  isEmpty(): Promise<boolean>;
  findAll(): Promise<Ticket[]>;
  findByType(type: TicketType): Promise<Ticket[]>;
  findOneById(id: TicketId): Promise<Ticket | null>;
  findOneByTime(time: TicketTime): Promise<Ticket | null>;
  bulkCreate(tickets: Ticket[]): Promise<void>;
  clear(): Promise<void>;
}
