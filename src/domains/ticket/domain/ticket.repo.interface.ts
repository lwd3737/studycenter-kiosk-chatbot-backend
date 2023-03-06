import { IRepo } from 'src/core/domain/repo';
import { TicketEntity } from './ticket.entity';

export const TicketRepoToken = Symbol('ticket-repo-token');

export interface ITicketRepo extends IRepo<TicketEntity> {
  init(): Promise<void>;
  getTickets(): Promise<TicketEntity[]>;
}
