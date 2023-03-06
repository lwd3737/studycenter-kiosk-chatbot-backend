import { Inject, Injectable } from '@nestjs/common';
import { IUseCase, UnexpectedError } from 'src/core/application';
import { err, ok, Result } from 'src/core/result';
import { TicketCategoryEnum } from '../../domain';
import { Ticket } from '../../domain/ticket.aggregate-root';
import {
  ITicketRepo,
  TicketRepoProvider,
} from '../../domain/ticket.repo.interface';
import { GetAllTicketCollectionsError, TicketNotFoundError } from '../errors';
import { InitTicketsUseCase } from './init-tickets.use-case';

type GetAllTicketCollectionsResult = Result<
  Ticket[][],
  GetAllTicketCollectionsError
>;

@Injectable()
export class GetAllTicketCollectionsUseCase
  implements IUseCase<never, GetAllTicketCollectionsResult>
{
  constructor(
    @Inject(TicketRepoProvider) private ticketRepo: ITicketRepo,
    private initTicketsUseCase: InitTicketsUseCase,
  ) {}
  private async resetThenRetry(): Promise<Ticket[]> {
    await this.initTicketsUseCase.execute();

    return await this.ticketRepo.getAllTickets();
  }

  private async getTickets(): Promise<
    Result<Ticket[], GetAllTicketCollectionsError>
  > {
    try {
      const tickets = await this.ticketRepo.getAllTickets();

      return ok(tickets);
    } catch (error) {
      if (error instanceof TicketNotFoundError) {
        const tickets = await this.resetThenRetry();

        return ok(tickets);
      }

      return err(error);
    }
  }
  private groupIntoCollectionsByCategory(tickets: Ticket[]): Ticket[][] {
    const periodCollection = tickets.filter(
      (ticket) => ticket.category.value === TicketCategoryEnum.PERIOD,
    );
    const hoursRechargeCollection = tickets.filter(
      (ticket) => ticket.category.value === TicketCategoryEnum.HOURS_RECHARGE,
    );
    const sameDayCollection = tickets.filter(
      (ticket) => ticket.category.value === TicketCategoryEnum.SAME_DAY,
    );

    return [periodCollection, hoursRechargeCollection, sameDayCollection];
  }

  async execute() {
    try {
      const ticketsResult = await this.getTickets();
      if (ticketsResult.isErr()) {
        return err(ticketsResult.error);
      }

      const ticketCollections = this.groupIntoCollectionsByCategory(
        ticketsResult.value,
      );

      return ok(ticketCollections);
    } catch (error) {
      return err(new UnexpectedError(error));
    }
  }
}
