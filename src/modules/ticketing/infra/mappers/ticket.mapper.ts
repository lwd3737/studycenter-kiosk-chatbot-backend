import { IMapper } from 'src/core/adapter/mapper.interface';
import { Ticket } from '../../domain/ticket/ticket.aggregate-root';

export class TicketMapper implements IMapper<Ticket> {
  toDomain(raw: any): Ticket {
    throw new Error('Method not implemented.');
  }
  toPersistence(domain: Ticket) {
    throw new Error('Method not implemented.');
  }
  toDTO(domain: Ticket) {
    throw new Error('Method not implemented.');
  }
}
