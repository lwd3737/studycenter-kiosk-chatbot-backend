import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { Ticket } from 'src/modules/ticketing/domain/ticket/ticket.aggregate-root';
import { Carousel } from '../../domain/carousel/carousel.value-object';
import { TicketCommerceCardsCarousel } from '../../domain/ticket-commerce-cards-carousel/ticket-commerce-cards-carousel.value-object';
import { GetTicketCommerceCardsCarouselError } from './get-ticket-cmmerce-cards-carousel.error';

type UseCaseInput = {
  tickets: Ticket[];
};

type UseCaseResult = Promise<
  Result<Carousel, GetTicketCommerceCardsCarouselError>
>;

@Injectable()
export class GetTicketCommerceCardsCarouselUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    const carouselResult = TicketCommerceCardsCarousel.create({
      tickets: input.tickets,
    });
    if (carouselResult.isErr()) {
      return err(carouselResult.error);
    }

    return ok(carouselResult.value);
  }
}
