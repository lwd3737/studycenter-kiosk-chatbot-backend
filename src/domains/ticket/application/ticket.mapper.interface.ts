import { IMapper } from 'src/core/infra';
import { TicketEntity } from '../domain/ticket.entity';

export const TicketMapperToken = Symbol('ticket-mapper-token');

export type ITicketMapper = IMapper<TicketEntity>;
