import { Inject, Injectable } from '@nestjs/common';
import { GetAllTicketCollectionsErrors } from 'src/domains/ticket/application/errors';
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
    @Inject(TicketMapperProvider) private ticketMapper: ITicketMapper,
  ) {}

  async getAllTickets(): Promise<Ticket[]> {
    const count = this.storage.length;
    if (count === 0) {
      throw new GetAllTicketCollectionsErrors.TicketNotFoundError();
    }

    const rawTickets = this.storage;

    return rawTickets.map((ticket) => this.ticketMapper.toDomain(ticket));
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
