import { Inject, Injectable } from '@nestjs/common';
import { TicketCategory } from 'src/modules/ticket/domain/ticket-category.value-object';
import {
  ITicketMapper,
  TicketMapperProvider,
} from '../../../adpater/ticket.mapper.interface';
import { Ticket } from '../../../domain/ticket.aggregate-root';
import { ITicketRepo } from '../../../domain/ticket.repo.interface';

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
export class InMemoryTicketRepo implements ITicketRepo {
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
