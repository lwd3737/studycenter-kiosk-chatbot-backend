import { TicketEntity } from '../../domain/ticket.entity';
import { ITicketRepo } from '../../domain/ticket.repo.interface';

export class TicketRepo implements ITicketRepo {
  init(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getTickets(): Promise<TicketEntity[]> {
    throw new Error('Method not implemented.');
  }

  delete(entity: TicketEntity): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
