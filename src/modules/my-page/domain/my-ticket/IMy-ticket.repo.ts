import { IRepo } from 'src/core/domain/repo.interface';
import { MyTicket } from './my-ticket.ar';

export const MyTicketRepoProvider = Symbol('MyTicketRepoProvider');

export interface IMyTicketRepo extends IRepo<MyTicket> {
  create(myTicket: MyTicket): Promise<void>;
  update(myTicket: MyTicket): Promise<void>;
  findOneById(myTicketId: string): Promise<MyTicket | null>;
  findOneByMemberId(memberId: string): Promise<MyTicket | null>;
  findByMemberId(memberId: string): Promise<MyTicket[]>;
}
