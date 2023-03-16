import { Inject, Injectable } from '@nestjs/common';
import { err, ok, Result } from 'src/core';
import { GetAllTicketCollectionsErrors } from '../../application/errors/get-all-ticket-collection.error';
import { TicketCategoryEnum } from '../ticket-category.value-object';
import { Ticket } from '../ticket.aggregate-root';
import { ITicketRepo, TicketRepoProvider } from '../ticket.repo.interface';

@Injectable()
export class TicketCollectionService {
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  public async groupIntoCollectionsByCategory(
    allTickets: Ticket[],
  ): Promise<
    Result<Ticket[][], GetAllTicketCollectionsErrors.TicketNotFoundError>
  > {
    const periodCollection = allTickets.filter(
      (ticket) => ticket.category.value === TicketCategoryEnum.PERIOD,
    );
    const hoursRechargeCollection = allTickets.filter(
      (ticket) => ticket.category.value === TicketCategoryEnum.HOURS_RECHARGE,
    );
    const sameDayCollection = allTickets.filter(
      (ticket) => ticket.category.value === TicketCategoryEnum.SAME_DAY,
    );

    return ok([periodCollection, hoursRechargeCollection, sameDayCollection]);
  }
}
