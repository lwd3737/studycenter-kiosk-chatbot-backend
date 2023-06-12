import { Inject, Injectable } from '@nestjs/common';
import { ok, Result } from 'src/core';
import { GetAllTicketCollectionsErrors } from '../../application/usecases/get-all-ticket-collection/get-all-ticket-collection.error';
import { ITicketRepo, Ticket, TicketRepoProvider } from '..';
import { PERIOD_TYPE } from '../period-ticket/type.value-object';
import { HOURS_RECHARGE_TYPE } from '../hours-recharge-ticket/type.value-object';
import { SAME_DAY_TYPE } from '../same-day-ticket/type.value-object';

@Injectable()
export class TicketCollectionService {
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  public async groupIntoCollectionsByType(
    allTickets: Ticket[],
  ): Promise<
    Result<Ticket[][], GetAllTicketCollectionsErrors.TicketNotExistError>
  > {
    const periodCollection = allTickets.filter(
      (ticket) => ticket.type.value === PERIOD_TYPE,
    );
    const hoursRechargeCollection = allTickets.filter(
      (ticket) => ticket.type.value === HOURS_RECHARGE_TYPE,
    );
    const sameDayCollection = allTickets.filter(
      (ticket) => ticket.type.value === SAME_DAY_TYPE,
    );

    return ok([periodCollection, hoursRechargeCollection, sameDayCollection]);
  }
}
