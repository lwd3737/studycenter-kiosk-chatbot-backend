import { Inject, Injectable } from '@nestjs/common';
import { TicketTime } from 'src/modules/kakao-chatbot/domain/ticket-time/ticket-time.value-object';
import { TicketCategory } from 'src/modules/ticketing/domain/ticket/ticket-category.value-object';
import { Ticket } from 'src/modules/ticketing/domain/ticket/ticket.aggregate-root';
import { ITicketRepo } from 'src/modules/ticketing/domain/ticket/ticket.repo.interface';
import {
  ITicketMapper,
  TicketMapperProvider,
} from '../../../adpater/ticket.mapper.interface';

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

  async getAllTickets(): Promise<Ticket[]> {
    return this.storage.map((ticket) => this.ticketMapper.toDomain(ticket));
  }

  async getTicketsByCategory(category: TicketCategory): Promise<Ticket[]> {
    const filteredTickets = this.storage.filter(
      (ticket) => ticket.category === category.value,
    );

    return filteredTickets.map((ticket) => this.ticketMapper.toDomain(ticket));
  }

  async getTicketByTime(time: TicketTime): Promise<Ticket | null> {
    const foundTicket = this.storage.find(
      (ticket) =>
        ticket.time.unit === time.unit && ticket.time.value === time.value,
    );
    if (!foundTicket) return null;

    return this.ticketMapper.toDomain(foundTicket);
  }

  async bulkCreate(tickets: Ticket[]): Promise<void> {
    const rawTickets = tickets.map(
      this.ticketMapper.toPersistence,
    ) as MockTicket[];

    this.storage = [...this.storage, ...rawTickets];
  }

  async clear(): Promise<void> {
    this.storage = [];
  }
}
