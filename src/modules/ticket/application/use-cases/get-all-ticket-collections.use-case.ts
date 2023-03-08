import { Injectable } from '@nestjs/common';
import { AppErrors, IUseCase } from 'src/core/application';
import { err, ok, Result } from 'src/core/result';
import { TicketCollectionService } from '../../domain/services/ticket-collection.service';
import { Ticket } from '../../domain/ticket.aggregate-root';

import { GetAllTicketCollectionsError } from '../errors';

type GetAllTicketCollectionsResult = Result<
  Ticket[][],
  GetAllTicketCollectionsError
>;

@Injectable()
export class GetAllTicketCollectionsUseCase
  implements IUseCase<never, GetAllTicketCollectionsResult>
{
  constructor(private ticketCollectionService: TicketCollectionService) {}

  async execute() {
    try {
      const ticketCollectionsResult =
        await this.ticketCollectionService.groupIntoCollectionsByCategory();
      if (ticketCollectionsResult.isErr()) {
        return err(ticketCollectionsResult.error);
      }

      return ok(ticketCollectionsResult.value);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
