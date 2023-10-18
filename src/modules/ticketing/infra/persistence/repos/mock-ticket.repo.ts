import { Inject, Injectable } from '@nestjs/common';
import {
  ITicketMapper,
  TicketMapperProvider,
} from '../../mappers/ITicket.mapper';
import {
  ITicketRepo,
  TicketType,
  Ticket,
  TicketId,
  TicketUsageDuration,
} from 'src/modules/ticketing/domain';

export type MockTicket = {
  id: string;
  title: string;
  type: TicketType;
  fixedSeat: boolean;
  usageDuration: {
    unit: 'DAYS' | 'HOURS';
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

  async findAll(): Promise<Ticket[]> {
    return this.storage.map((ticket) => this.ticketMapper.toDomain(ticket));
  }

  async findOneById(id: TicketId): Promise<Ticket | null> {
    const found = this.storage.find((ticket) => ticket.id === id.value);
    if (!found) return null;

    return this.ticketMapper.toDomain(found);
  }

  async findByType(type: TicketType): Promise<Ticket[]> {
    const filtered = this.storage.filter((ticket) => ticket.type === type);
    return filtered.map((ticket) => this.ticketMapper.toDomain(ticket));
  }

  async findOneByUsageTime(
    usageTime: TicketUsageDuration,
  ): Promise<Ticket | null> {
    const found = this.storage.find(
      (ticket) =>
        ticket.usageDuration.unit === usageTime.unit &&
        ticket.usageDuration.value === usageTime.value,
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
