import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { GetAllTicketCollectionsUseCase } from 'src/modules/ticketing';
import { TicketListCarousel } from '../../domain/ticket-list-carousel/ticket-list-carousel.value-object';
import { KakaoChatbotRequestDTO } from '../../dtos/request.dto';
import { GetTicketListCarouselError } from './get-ticket-list-carousel.error';
import { Carousel } from '../../domain/base/carousel/carousel.value-object';

type TicketListCarouselResult = Promise<
  Result<Carousel, GetTicketListCarouselError>
>;

@Injectable()
export class GetTicketListCarouselUseCase
  implements IUseCase<KakaoChatbotRequestDTO, TicketListCarouselResult>
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
