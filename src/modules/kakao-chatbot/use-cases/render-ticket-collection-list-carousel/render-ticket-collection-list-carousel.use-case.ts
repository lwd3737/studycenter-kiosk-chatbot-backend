import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { GetAllTicketCollectionsUseCase } from 'src/modules/ticketing';
import { KakaoChatbotRequestDTO } from '../../dtos/request.dto';
import { RenderTicketCollectionListCarouselError } from './render-ticket-collection-list-carousel.error';
import { TicketCollectionListCardCarousel } from '../../domain/ticket-collection-list-card-carousel/ticket-collection-list-card-carousel.value-object';

type TicketCollectionListCarouselResult = Promise<
  Result<
    TicketCollectionListCardCarousel,
    RenderTicketCollectionListCarouselError
  >
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

    const ticketCollectionListCardCarousel =
      TicketCollectionListCardCarousel.createFrom({
        ticketCollections: allTicketCollectionsOrError.value,
      });
    if (ticketCollectionListCardCarousel.isErr()) {
      return err(ticketCollectionListCardCarousel.error);
    }

    return ok(ticketCollectionListCardCarousel.value);
  }
}
