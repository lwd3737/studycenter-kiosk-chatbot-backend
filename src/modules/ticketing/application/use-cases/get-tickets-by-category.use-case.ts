import { Inject, Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import {
  TicketCategory,
  TicketCategoryEnum,
} from '../../domain/ticket/ticket-category.value-object';
import { Ticket } from '../../domain/ticket/ticket.aggregate-root';
import {
  ITicketRepo,
  TicketRepoProvider,
} from '../../domain/ticket/ticket.repo.interface';

import { GetAllTicketCollectionsError } from '../errors/get-all-ticket-collection.error';
import {
  GetTicketsByCategoryError,
  GetTicketsByCategoryErrors,
} from '../errors/get-ticket-collection-by-category.error';

type UseCaseInput = {
  category: TicketCategoryEnum;
};

type UseCaseResult = Promise<Result<Ticket[], GetTicketsByCategoryError>>;

@Injectable()
export class GetTicketsByCategoryUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  async execute(input: UseCaseInput) {
    const categoryResult = TicketCategory.create(input.category);
    if (categoryResult.isErr()) {
      return err(categoryResult.error);
    }

    try {
      const tickets = await this.ticketRepo.getTicketsByCategory(
        categoryResult.value,
      );
      if (tickets.length === 0) {
        return err(new GetTicketsByCategoryErrors.TicketNotFoundError());
      }

      return ok(tickets);
    } catch (error) {
      return err(error as GetAllTicketCollectionsError);
    }
  }
}
