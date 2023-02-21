import { Inject, Injectable } from '@nestjs/common';
import {
  ITicketMapper,
  TicketMapperToken,
} from '../../../application/ticket.mapper.interface';
import { TicketEntity } from '../../../domain/ticket.entity';
import { ITicketRepo } from '../../../domain/ticket.repo.interface';
import {
  GongDreamTicket,
  GongDreamTicketsToken,
} from '../../gongdream-data.loader';

@Injectable()
export class MockTicketRepo implements ITicketRepo {
  private storage = {} as GongDreamTicket[];

  constructor(
    @Inject(GongDreamTicketsToken) private gongdreamTickets: GongDreamTicket[],
    @Inject(TicketMapperToken) private ticketMapper: ITicketMapper,
  ) {}

  async init(): Promise<void> {
    this.storage = this.gongdreamTickets;
  }

  async getTickets(): Promise<TicketEntity[]> {
    const count = Object.keys(this.storage).length;
    if (count === 0) {
      this.init();
    }

    const rawTickets = this.storage;
    const ticketEntities = rawTickets.map((ticket) =>
      this.ticketMapper.toDomain(ticket),
    );

    return ticketEntities;
  }

  async save(entity: TicketEntity): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async delete(entity: TicketEntity): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
