import { IMapper } from 'src/core';
import { ITicketDTO } from '../application/dtos/ticket.dto.interface';
import { Ticket } from '../domain/ticket.aggregate-root';

export const TicketMapperProvider = Symbol('ticket-mapper-token');

export interface ITicketMapper extends IMapper<Ticket> {
  toDomain(raw: any): Ticket;
  toDTO(ticket: Ticket): ITicketDTO;
  toPersistence(ticket: Ticket): any;
}
