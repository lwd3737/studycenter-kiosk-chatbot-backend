import { MyTicket } from '../../domain/my-ticket/my-ticket.ar';

export interface IMyTicketMapper {
  toPersistence(domain: MyTicket): any;
}
