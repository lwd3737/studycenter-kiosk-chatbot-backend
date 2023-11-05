import { MyTicket } from './my-ticket.ar';

export abstract class IMyTicketRepo {
  abstract create(myTicket: MyTicket): Promise<MyTicket>;
  abstract update(myTicket: MyTicket): Promise<MyTicket>;
  abstract findOneById(myTicketId: string): Promise<MyTicket | null>;
  abstract findOneByMemberId(memberId: string): Promise<MyTicket | null>;
  abstract findByMemberId(memberId: string): Promise<MyTicket[]>;
}
