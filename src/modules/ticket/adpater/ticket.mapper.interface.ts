import { IMapper } from 'src/core';
import { ITicketDTO } from '../application';
import { Ticket } from '../domain';

export const TicketMapperProvider = Symbol('ticket-mapper-token');

export interface ITicketMapper extends IMapper<Ticket> {
  toDomain(raw: any): Ticket;
  toDTO(ticket: Ticket): ITicketDTO;
  toPersistence(ticket: Ticket): any;
}
