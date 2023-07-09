import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { GetAllTicketCollectionsUseCase } from 'src/modules/ticketing';
import { KakaoChatbotRequestDTO } from '../../dtos/request.dto';
import { RenderTicketCollectionListCardCarouselError } from './render-ticket-collection-list-card-carousel.error';
import { TicketCollectionListCardCarousel } from '../../domain/ticket-collection-list-card-carousel/ticket-collection-list-card-carousel.value-object';

type UseCaseResult = Promise<
  Result<
    TicketCollectionListCardCarousel,
    RenderTicketCollectionListCardCarouselError
  >
>;

@Injectable()
export class RenderTicketCollectionListCardCarouselUseCase
  implements IUseCase<KakaoChatbotRequestDTO, UseCaseResult>
{
  constructor(
    private getAllTicketCollectionsUseCase: GetAllTicketCollectionsUseCase,
  ) {}

  async execute(): Promise<UseCaseResult> {
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
