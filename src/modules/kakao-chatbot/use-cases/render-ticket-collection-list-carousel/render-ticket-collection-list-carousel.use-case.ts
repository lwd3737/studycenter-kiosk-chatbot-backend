import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { GetAllTicketCollectionsUseCase } from 'src/modules/ticketing';
import { TicketListCarousel } from '../../domain/ticket-collection-list-card-carousel/ticket-collection-list-card-carousel.value-object';
import { KakaoChatbotRequestDTO } from '../../dtos/request.dto';
import { RenderTicketCollectionListCarouselError } from './render-ticket-collection-list-carousel.error';
import { Carousel } from '../../domain/base/carousel/carousel.value-object';

type TicketCollectionListCarouselResult = Promise<
  Result<Carousel, RenderTicketCollectionListCarouselError>
>;

@Injectable()
export class RenderTicketCollectionListCarouselUseCase
  implements
    IUseCase<KakaoChatbotRequestDTO, TicketCollectionListCarouselResult>
{
  constructor(
    private getAllTicketCollectionsUseCase: GetAllTicketCollectionsUseCase,
  ) {}

  async execute(): Promise<TicketCollectionListCarouselResult> {
    const allTicketCollectionsOrError =
      await this.getAllTicketCollectionsUseCase.execute();
    if (allTicketCollectionsOrError.isErr()) {
      return err(allTicketCollectionsOrError.error);
    }

    const ticketListCarouselResult = TicketListCarousel.create({
      ticketCollections: allTicketCollectionsOrError.value,
    });
    if (ticketListCarouselResult.isErr()) {
      return err(ticketListCarouselResult.error);
    }

    return ok(ticketListCarouselResult.value);
  }
}
