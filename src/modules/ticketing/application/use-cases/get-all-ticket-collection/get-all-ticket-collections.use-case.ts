import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, IUseCase } from 'src/core/application';
import { err, ok, Result } from 'src/core/result';
import { TicketCollectionService } from '../../../domain/services/ticket-collection.service';
import { Ticket } from '../../../domain/ticket/ticket.aggregate-root';
import {
  ITicketRepo,
  TicketRepoProvider,
} from '../../../domain/ticket/ticket.repo.interface';

import {
  GetAllTicketCollectionsError,
  GetAllTicketCollectionsErrors,
} from './get-all-ticket-collection.error';

type UseCaseResult = Result<Ticket[][], GetAllTicketCollectionsError>;

@Injectable()
export class GetAllTicketCollectionsUseCase
  implements IUseCase<never, UseCaseResult>
{
  constructor(
    @Inject(TicketRepoProvider) private ticketRepo: ITicketRepo,
    private ticketCollectionService: TicketCollectionService,
  ) {}

  async execute() {
    try {
      const allTickets = await this.ticketRepo.getAllTickets();
      if (allTickets.length === 0) {
        return err(new GetAllTicketCollectionsErrors.TicketNotExistError());
      }

      const ticketCollectionsResult =
        await this.ticketCollectionService.groupIntoCollectionsByCategory(
          allTickets,
        );
      if (ticketCollectionsResult.isErr()) {
        return err(ticketCollectionsResult.error);
      }

      return ok(ticketCollectionsResult.value);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
