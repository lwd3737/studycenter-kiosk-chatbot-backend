import { Injectable } from '@nestjs/common';
import { AppErros, err, IUseCase, ok, Result, UnexpectedError } from 'src/core';
import { GetAllTicketCollectionsUseCase } from 'src/domains/ticket';
import { TicketListCarousel } from '../../domain/ticket-list-carousel.value-object';
import { IKakaoChatbotRequestDTO } from '../../dtos';
import { GetTicketListCarouselError } from './get-ticcket-list-carousel.error';

type TicketListCarouselResult = Promise<
  Result<TicketListCarousel, GetTicketListCarouselError>
>;

@Injectable()
export class GetTicketListCarouselUseCase
  implements IUseCase<IKakaoChatbotRequestDTO, TicketListCarouselResult>
{
  constructor(
    private getAllTicketCollectionsUseCase: GetAllTicketCollectionsUseCase,
  ) {}

  async execute(
    request?: IKakaoChatbotRequestDTO,
  ): Promise<TicketListCarouselResult> {
    const allTicketCollectionsResult =
      await this.getAllTicketCollectionsUseCase.execute();
    if (allTicketCollectionsResult.isErr()) {
      return err(allTicketCollectionsResult.error);
    }

    try {
      const ticketListCarouselResult = TicketListCarousel.build({
        ticketCollections: allTicketCollectionsResult.value,
      });
      if (ticketListCarouselResult.isErr()) {
        return err(ticketListCarouselResult.error);
      }

      return ok(ticketListCarouselResult.value);
    } catch (error) {
      return err(new AppErros.UnexpectedError(error));
    }
  }
}
