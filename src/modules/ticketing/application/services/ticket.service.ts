import { Inject, Injectable } from '@nestjs/common';
import {
  HOURS_RECHARGE_TYPE,
  ITicketRepo,
  PERIOD_TYPE,
  SAME_DAY_TYPE,
  Ticket,
  TicketId,
  TicketRepoProvider,
  TicketType,
} from '../../domain';

@Injectable()
export class TicketService {
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  public async findAll(): Promise<Ticket[]> {
    return await this.ticketRepo.findAll();
  }

  public async groupByType(): Promise<Ticket[][]> {
    const tickets = await this.ticketRepo.findAll();

    const periodCollection = tickets.filter(
      (ticket) => ticket.type.value === PERIOD_TYPE,
    );
    const hoursRechargeCollection = tickets.filter(
      (ticket) => ticket.type.value === HOURS_RECHARGE_TYPE,
    );
    const sameDayCollection = tickets.filter(
      (ticket) => ticket.type.value === SAME_DAY_TYPE,
    );

    return [periodCollection, hoursRechargeCollection, sameDayCollection];
  }

  public async findOneById(id: TicketId): Promise<Ticket | null> {
    return await this.ticketRepo.findOneById(id);
  }

  public async findByType(type: TicketType): Promise<Ticket[]> {
    return await this.ticketRepo.findByType(type);
  }
}
