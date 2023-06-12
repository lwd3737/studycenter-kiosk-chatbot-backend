import { Inject, Injectable } from '@nestjs/common';
import {
  ITicketMapper,
  TicketMapperProvider,
} from '../../mappers/ITicket.mapper';
import {
  ITicketRepo,
  TTicketType,
  Ticket,
  TicketTime,
  TicketTimeUnit,
  TicketType,
} from 'src/modules/ticketing/domain';
import { ExpirationType } from 'src/modules/ticketing/domain/ticket/expiration.value-object';

export type MockTicket = {
  title: string;
  type: TTicketType;
  isFixedSeat: boolean;
  time: {
    unit: TicketTimeUnit;
    value: number;
  };
  price: number;
  expiration: {
    type: ExpirationType;
  };
};

@Injectable()
export class MockTicketRepo implements ITicketRepo {
  private storage: MockTicket[] = [];

  constructor(
    @Inject(TicketMapperProvider) private ticketMapper: ITicketMapper, //private initTicketUseCase: InitTicketUseCase,
  ) {}

  async isEmpty(): Promise<boolean> {
    return this.storage.length === 0;
  }

  async getAllTickets(): Promise<Ticket[]> {
    return this.storage.map((ticket) => this.ticketMapper.toDomain(ticket));
  }

  async getTicketsByType(type: TicketType): Promise<Ticket[]> {
    const filtered = this.storage.filter(
      (ticket) => ticket.type === type.value,
    );
    return filtered.map((ticket) => this.ticketMapper.toDomain(ticket));
  }

  async getTicketByTime(time: TicketTime): Promise<Ticket | null> {
    const found = this.storage.find(
      (ticket) =>
        ticket.time.unit === time.unit && ticket.time.value === time.value,
    );
    if (!found) return null;

    return this.ticketMapper.toDomain(found);
  }

  async bulkCreate(tickets: Ticket[]): Promise<void> {
    const raws = tickets.map(this.ticketMapper.toPersistence) as MockTicket[];
    this.storage = [...this.storage, ...raws];
  }

  async clear(): Promise<void> {
    this.storage = [];
  }
}
