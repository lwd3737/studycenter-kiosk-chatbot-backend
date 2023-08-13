import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { RenderTicketCommerceCardsCarouselError } from './render-ticket-cmmerce-cards-carousel.error';
import { Ticket } from 'src/modules/ticketing';
import { CommerceCardCarousel } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/commerce-card-carousel/commerce-card-carousel.value-object';
import { TicketCommerceCardCarousel } from 'src/modules/kakao-chatbot/domain/ticket-commerce-card-carousel/ticket-commerce-card-carousel.value-object';

type UseCaseInput = {
  tickets: Ticket[];
};

type UseCaseResult = Promise<
  Result<CommerceCardCarousel, RenderTicketCommerceCardsCarouselError>
>;

@Injectable()
export class RenderTicketCommerceCardsCarouselUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    const carouselOrError = TicketCommerceCardCarousel.createFrom({
      tickets: input.tickets,
    });
    if (carouselOrError.isErr()) {
      return err(carouselOrError.error);
    }

    return ok(carouselOrError.value);
  }
}