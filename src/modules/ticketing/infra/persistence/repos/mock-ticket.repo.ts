import { Inject, Injectable } from '@nestjs/common';
import { TicketCategory } from 'src/modules/ticketing/domain/ticket/ticket-category.value-object';
import { Ticket } from 'src/modules/ticketing/domain/ticket/ticket.aggregate-root';
import { ITicketRepo } from 'src/modules/ticketing/domain/ticket/ticket.repo.interface';
import {
  ITicketMapper,
  TicketMapperProvider,
} from '../../mappers/ticket.mapper.interface';
import { TicketTime } from 'src/modules/ticketing/domain/ticket/ticket-time.value-object';

export type MockTicket = {
  title: string;
  category: string;
  time: {
    unit: string;
    value: number;
  };
  price: number;
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

  async getTicketsByCategory(category: TicketCategory): Promise<Ticket[]> {
    const filtered = this.storage.filter(
      (ticket) => ticket.category === category.value,
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
