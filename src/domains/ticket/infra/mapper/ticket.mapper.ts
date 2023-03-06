import { IMapper } from 'src/core/infra/mapper.interface';
import { TicketEntity } from '../domain/ticket.entity';

export class TicketMapper implements IMapper<TicketEntity> {
  toDomain(raw: any): TicketEntity {
    throw new Error('Method not implemented.');
  }
  toPersistence(domain: TicketEntity) {
    throw new Error('Method not implemented.');
  }
  toDTO(domain: TicketEntity) {
    throw new Error('Method not implemented.');
  }
}
