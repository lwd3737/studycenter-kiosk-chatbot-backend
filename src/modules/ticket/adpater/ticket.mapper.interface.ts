import { IMapper } from 'src/core';
import { TicketDTO } from '../application/dtos/ticket.dto';
import { Ticket } from '../domain/ticket.aggregate-root';

export const TicketMapperProvider = Symbol('ticket-mapper-token');

export interface ITicketMapper extends IMapper<Ticket> {
  toDomain(raw: any): Ticket;
  toDTO(ticket: Ticket): TicketDTO;
  toPersistence(ticket: Ticket): any;
}
