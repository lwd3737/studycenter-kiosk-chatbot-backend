import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { Ticket } from 'src/modules/ticketing/domain/ticket/ticket.aggregate-root';
import { TicketCommerceCardsCarousel } from '../../domain/ticket-commerce-cards-carousel/ticket-commerce-cards-carousel.value-object';
import { RenderTicketCommerceCardsCarouselError } from './render-ticket-cmmerce-cards-carousel.error';
import { Carousel } from '../../domain/base/carousel/carousel.value-object';

type UseCaseInput = {
  tickets: Ticket[];
};

type UseCaseResult = Promise<
  Result<Carousel, RenderTicketCommerceCardsCarouselError>
>;

@Injectable()
export class RenderTicketCommerceCardsCarouselUseCase
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
