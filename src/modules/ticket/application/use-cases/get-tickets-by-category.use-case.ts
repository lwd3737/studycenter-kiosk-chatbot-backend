import { Inject, Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import {
  TicketCategory,
  TicketCategoryEnum,
} from '../../domain/ticket-category.value-object';
import { Ticket } from '../../domain/ticket.aggregate-root';
import {
  ITicketRepo,
  TicketRepoProvider,
} from '../../domain/ticket.repo.interface';
import { GetAllTicketCollectionsError } from '../errors/get-all-ticket-collection.error';
import {
  GetTicketsByCategoryError,
  GetTicketsByCategoryErrors,
} from '../errors/get-ticket-collection-by-category.error';

type UseCaseInput = {
  category: string;
};

type UseCaseResult = Promise<Result<Ticket[], GetTicketsByCategoryError>>;

@Injectable()
export class GetTicketsByCategoryUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  private static TICKET_CATEGORIES_MAP: {
    [category: string]: TicketCategoryEnum;
  } = {
    period_ticket: TicketCategoryEnum.PERIOD,
    hours_recharge_ticket: TicketCategoryEnum.HOURS_RECHARGE,
    same_day_ticket: TicketCategoryEnum.SAME_DAY,
  };

  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  async execute(input: UseCaseInput) {
    const category =
      GetTicketsByCategoryUseCase.TICKET_CATEGORIES_MAP[input.category];

    const categoryResult = TicketCategory.create(category);
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
