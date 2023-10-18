import { IMapper } from 'src/core/adapter/mapper.interface';
import { Ticket } from 'src/modules/ticketing/domain/ticket/ticket.ar';

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
