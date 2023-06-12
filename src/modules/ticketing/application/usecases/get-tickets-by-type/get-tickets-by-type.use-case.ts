import { Inject, Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { GetAllTicketCollectionsError } from '../get-all-ticket-collection/get-all-ticket-collection.error';
import {
  GetTicketsByTypeError,
  GetTicketsByTypeErrors,
} from './get-ticket-collection-by-type.error';
import {
  ITicketRepo,
  Ticket,
  TicketRepoProvider,
  TicketType,
} from 'src/modules/ticketing/domain';

type UseCaseInput = {
  type: TicketType;
};

type UseCaseResult = Promise<Result<Ticket[], GetTicketsByTypeError>>;

@Injectable()
export class GetTicketsByTypeUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  async execute(input: UseCaseInput) {
    try {
      const tickets = await this.ticketRepo.getTicketsByType(input.type);
      if (tickets.length === 0) {
        return err(new GetTicketsByTypeErrors.TicketNotFoundError());
      }

      return ok(tickets);
    } catch (error) {
      return err(error as GetAllTicketCollectionsError);
    }
  }
}
