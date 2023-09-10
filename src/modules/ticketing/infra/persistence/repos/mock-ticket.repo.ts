import { Inject, Injectable } from '@nestjs/common';
import {
  ITicketMapper,
  TicketMapperProvider,
} from '../../mappers/ITicket.mapper';
import {
  ITicketRepo,
  TicketTypeKind,
  Ticket,
  TicketId,
  TicketTime,
  TicketTimeUnitCategory,
  TicketType,
} from 'src/modules/ticketing/domain';
import { ExpirationTypeCategory } from 'src/modules/ticketing/domain/ticket/expiration-type.value-object';

export type MockTicket = {
  id: string;
  title: string;
  type: TicketTypeKind;
  isFixedSeat: boolean;
  time: {
    unit: TicketTimeUnitCategory;
    value: number;
  };
  price: number;
  expiration: {
    type: ExpirationTypeCategory;
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

  async findAll(): Promise<Ticket[]> {
    return this.storage.map((ticket) => this.ticketMapper.toDomain(ticket));
  }

  async findOneById(id: TicketId): Promise<Ticket | null> {
    const found = this.storage.find((ticket) => ticket.id === id.value);
    if (!found) return null;

    return this.ticketMapper.toDomain(found);
  }

  async findByType(type: TicketType): Promise<Ticket[]> {
    const filtered = this.storage.filter(
      (ticket) => ticket.type === type.value,
    );
    return filtered.map((ticket) => this.ticketMapper.toDomain(ticket));
  }

  async findOneByTime(time: TicketTime): Promise<Ticket | null> {
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
