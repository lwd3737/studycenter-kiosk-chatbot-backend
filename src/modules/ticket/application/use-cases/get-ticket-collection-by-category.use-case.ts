import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { ITicketRepo, Ticket, TicketRepoProvider } from '../../domain';
import { GetAllTicketCollectionsError } from '../errors';

type UseCaseInput = {
  category: string;
};

type UseCaseResult = Promise<Result<Ticket[], GetAllTicketCollectionsError>>;

@Injectable()
export class GetTicketCollectionByCategoryUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  async execute(input: UseCaseInput) {
    try {
      // const tickets = await this.ticketRepo.getAllTickets({
      //   category: input.category,
      // });

      return ok([]);
    } catch (error) {
      return err(error as AppErrors.UnexpectedError);
    }
  }
}
