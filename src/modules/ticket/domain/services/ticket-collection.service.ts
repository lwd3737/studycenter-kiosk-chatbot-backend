import { Inject, Injectable } from '@nestjs/common';
import { err, ok, Result } from 'src/core';
import { TicketNotFoundError } from '../../application';
import { TicketCategoryEnum } from '../ticket-category.value-object';
import { Ticket } from '../ticket.aggregate-root';
import { ITicketRepo, TicketRepoProvider } from '../ticket.repo.interface';

@Injectable()
export class TicketCollectionService {
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  public async groupIntoCollectionsByCategory(): Promise<
    Result<Ticket[][], TicketNotFoundError>
  > {
    const ticketsResult = await this.getAllTickets();
    if (ticketsResult.isErr()) {
      return err(ticketsResult.error);
    }

    const tickets = ticketsResult.value;

    const periodCollection = tickets.filter(
      (ticket) => ticket.category.value === TicketCategoryEnum.PERIOD,
    );
    const hoursRechargeCollection = tickets.filter(
      (ticket) => ticket.category.value === TicketCategoryEnum.HOURS_RECHARGE,
    );
    const sameDayCollection = tickets.filter(
      (ticket) => ticket.category.value === TicketCategoryEnum.SAME_DAY,
    );

    return ok([periodCollection, hoursRechargeCollection, sameDayCollection]);
  }

  private async getAllTickets(): Promise<
    Result<Ticket[], TicketNotFoundError>
  > {
    try {
      const tickets = await this.ticketRepo.getAllTickets();

      return ok(tickets);
    } catch (error) {
      return err(error);
    }
  }
}
