import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result, UnknownError } from 'src/core';
import { GetTicketGroupError } from './get-ticket-group.error';
import { CommerceCardCarousel } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/commerce-card-carousel/commerce-card-carousel.value-object';
import { TicketCommerceCardCarousel } from 'src/modules/kakao-chatbot/domain/ticket-commerce-card-carousel/ticket-commerce-card-carousel.value-object';
import { TicketService, TicketType } from 'src/modules/ticketing';

type UseCaseInput = {
  ticketType: TicketType;
};

type UseCaseResult = Promise<Result<CommerceCardCarousel, GetTicketGroupError>>;

@Injectable()
export class GetTicketGroupUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(private ticketService: TicketService) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const foundTickets = await this.ticketService.findByType(
        input.ticketType,
      );
      const carouselOrError = TicketCommerceCardCarousel.from({
        tickets: foundTickets,
      });
      if (carouselOrError.isErr()) {
        return err(carouselOrError.error);
      }

      return ok(carouselOrError.value);
    } catch (error) {
      return err(new UnknownError(error.message));
    }
  }
}
