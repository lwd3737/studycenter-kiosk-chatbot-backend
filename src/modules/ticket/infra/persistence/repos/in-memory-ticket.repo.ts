import { Inject, Injectable } from '@nestjs/common';
import { TicketNotFoundError } from 'src/modules/ticket/application';
import { TicketCategory } from 'src/modules/ticket/domain';
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
    const count = this.storage.length;
    if (count === 0) {
      throw new TicketNotFoundError();
    }

    const rawTickets = this.storage;

    return rawTickets.map((ticket) => this.ticketMapper.toDomain(ticket));
  }

  async getTicketsByCategory(category: TicketCategory): Promise<Ticket[]> {
    const ticketsFound = this.storage.filter(
      (ticket) => ticket.category === category.value,
    );
    if (ticketsFound.length === 0) {
      throw new TicketNotFoundError();
    }

    return ticketsFound.map((ticket) => this.ticketMapper.toDomain(ticket));
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
