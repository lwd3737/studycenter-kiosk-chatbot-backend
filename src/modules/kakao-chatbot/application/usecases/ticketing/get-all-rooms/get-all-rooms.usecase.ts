import { Injectable } from '@nestjs/common';
import { DomainError, IUseCase, Result, UnknownError, err } from 'src/core';
import { RoomItemCardCarousel } from 'src/modules/kakao-chatbot/domain/room-item-card-carousel/room-item-card-carousel.value-object';
import { TicketingContextService } from 'src/modules/ticketing/application/services/ticketing-context.service';
import { SeatService } from 'src/modules/seat-management/services/seat.service';
import { CustomConfigService } from 'src/modules/config';

type UseCaseInput = {
  appUserId: string;
  ticketId: string;
};
type UseCaseResult = Result<RoomItemCardCarousel, DomainError>;

@Injectable()
export class GetAllRoomsUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(
    private configService: CustomConfigService,
    private ticketingContextService: TicketingContextService,
    private seatService: SeatService,
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    const blockId = this.configService.get(
      'kakao.blockIds.ticketing.getAvailableSeatsInRoom',
      { infer: true },
    )!;

    try {
      this.ticketingContextService.save(input.appUserId, {
        ticketId: input.ticketId,
      });

      return RoomItemCardCarousel.new({
        blockId,
        rooms: await this.seatService.findAllRoomInfo(),
      });
    } catch (error) {
      return err(new UnknownError(error.message));
    }
  }
}
