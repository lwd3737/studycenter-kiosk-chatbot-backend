import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { GetAllTicketCollectionsUseCase } from 'src/modules/ticket';
import { Carousel } from '../../domain/carousel/carousel.value-object';
import { TicketListCarousel } from '../../domain/ticket-list-carousel.value-object';
import { IKakaoChatbotRequestDTO } from '../../dtos/kakao-chatbot-request.dto.interface';
import { GetTicketListCarouselError } from './get-ticket-list-carousel.error';

type TicketListCarouselResult = Promise<
  Result<Carousel, GetTicketListCarouselError>
>;

@Injectable()
export class GetTicketListCarouselUseCase
  implements IUseCase<IKakaoChatbotRequestDTO, TicketListCarouselResult>
{
  constructor(
    private getAllTicketCollectionsUseCase: GetAllTicketCollectionsUseCase,
  ) {}

  async execute(): Promise<TicketListCarouselResult> {
    const allTicketCollectionsResult =
      await this.getAllTicketCollectionsUseCase.execute();
    if (allTicketCollectionsResult.isErr()) {
      return err(allTicketCollectionsResult.error);
    }

    const ticketListCarouselResult = TicketListCarousel.create({
      ticketCollections: allTicketCollectionsResult.value,
    });
    if (ticketListCarouselResult.isErr()) {
      return err(ticketListCarouselResult.error);
    }

    return ok(ticketListCarouselResult.value);
  }
}
