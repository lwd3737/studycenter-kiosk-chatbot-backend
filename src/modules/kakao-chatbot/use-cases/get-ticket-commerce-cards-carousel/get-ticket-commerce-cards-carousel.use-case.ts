import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { GetTicketsByCategoryUseCase } from 'src/modules/ticket';
import { TicketCategoryEnum } from 'src/modules/ticket/domain/ticket-category.value-object';
import { Carousel } from '../../domain/carousel/carousel.value-object';
import { TicketCommerceCardsCarousel } from '../../domain/ticket-commerce-cards-carousel.value-object';
import { GetTicketCommerceCardsCarouselError } from './get-ticket-cmmerce-cards-carousel.error';

type UseCaseInput = {
  category: TicketCategoryEnum;
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
