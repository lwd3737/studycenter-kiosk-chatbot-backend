import { Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result, UnknownError } from 'src/core';
import { TicketService } from 'src/modules/ticketing';
import { KakaoChatbotRequestDTO } from '../../../dtos/request.dto';
import { GetTicketGroupsError } from './get-ticket-groups.error';
import { TicketGroupListCardCarousel } from 'src/modules/kakao-chatbot/domain/ticket-group-list-card-carousel/ticket-group-list-card-carousel.value-object';

type UseCaseResult = Promise<
  Result<TicketGroupListCardCarousel, GetTicketGroupsError>
>;

@Injectable()
export class GetTicketGroupsUseCase
  implements IUseCase<KakaoChatbotRequestDTO, UseCaseResult>
{
  constructor(private ticketService: TicketService) {}

  async execute(): Promise<UseCaseResult> {
    try {
      const groups = await this.ticketService.groupByType();
      const ticketGroupListCardCarousel = TicketGroupListCardCarousel.from({
        ticketGroups: groups,
      });
      if (ticketGroupListCardCarousel.isErr())
        return err(ticketGroupListCardCarousel.error);

      return ok(ticketGroupListCardCarousel.value);
    } catch (error) {
      return err(new UnknownError(error.message));
    }
  }
}
