import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { GetTicketsByCategoryUseCase } from 'src/modules/ticket';
import { Carousel } from '../../domain';
import { TicketCommerceCardsCarousel } from '../../domain/ticket-commerce-cards-carousel.value-object';
import { GetTicketCommerceCardsCarouselError } from './get-ticket-cmmerce-cards-carousel.error';

type UseCaseInput = {
  category: 'period_ticket' | 'hours_recharge_ticket' | 'same_day_ticket';
};

type UseCaseResult = Promise<
  Result<Carousel, GetTicketCommerceCardsCarouselError>
>;

@Injectable()
export class GetTicketCommerceCardsCarouselUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(
    private getTicketsByCategoryUseCase: GetTicketsByCategoryUseCase,
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    const ticketsByCategoryResult =
      await this.getTicketsByCategoryUseCase.execute({
        category: input.category,
      });
    if (ticketsByCategoryResult.isErr()) {
      return err(ticketsByCategoryResult.error);
    }

    const carouselResult = TicketCommerceCardsCarousel.create({
      tickets: ticketsByCategoryResult.value,
    });
    if (carouselResult.isErr()) {
      return err(carouselResult.error);
    }

    return ok(carouselResult.value);
  }
}
