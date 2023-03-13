import { Inject, Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import {
  ITicketRepo,
  Ticket,
  TicketCategory,
  TicketCategoryEnum,
  TicketRepoProvider,
} from '../../domain';
import { GetAllTicketCollectionsError } from '../errors';

type GetTicketsByCategoryInput = {
  category: string;
};

type GetTicketsByCategoryResult = Promise<
  Result<Ticket[], GetAllTicketCollectionsError>
>;

@Injectable()
export class GetTicketsByCategoryUseCase
  implements IUseCase<GetTicketsByCategoryInput, GetTicketsByCategoryResult>
{
  private static TICKET_CATEGORIES_MAP: {
    [category: string]: TicketCategoryEnum;
  } = {
    period_ticket: TicketCategoryEnum.PERIOD,
    hours_recharge_ticket: TicketCategoryEnum.HOURS_RECHARGE,
    same_day_ticket: TicketCategoryEnum.SAME_DAY,
  };

  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  async execute(input: GetTicketsByCategoryInput) {
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

      return ok(tickets);
    } catch (error) {
      return err(error as GetAllTicketCollectionsError);
    }
  }
}
