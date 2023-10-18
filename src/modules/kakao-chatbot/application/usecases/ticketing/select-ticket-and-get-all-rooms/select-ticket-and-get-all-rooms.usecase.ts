import { Injectable } from '@nestjs/common';
import { DomainError, IUseCase, Result, UnknownError, err } from 'src/core';
import { ItemCardCarousel } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/item-card-carousel/item-card-carousel.value-object';
import { RoomItemCardCarousel } from 'src/modules/kakao-chatbot/domain/room-item-card-carousel/room-item-card-carousel.value-object';
import { SeatService } from 'src/modules/seat-management/services/seat.service';
import { TicketingContextService } from 'src/modules/ticketing/application/services/ticketing-context.service';

type UseCaseInput = {
  appUserId: string;
  ticketId: string;
};

type UseCaseResult = Result<ItemCardCarousel, DomainError>;

@Injectable()
export class SelectTicketAndGetAllRoomsUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(
    private seatService: SeatService,
    private ticketingContextService: TicketingContextService,
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      this.ticketingContextService.save(input.appUserId, {
        ticketId: input.ticketId,
      });

      const allRooms = await this.seatService.findAllRooms();
      const allRoomsInfo = await Promise.all(
        allRooms.map(async (room) => ({
          room,
          seats: await this.seatService.findSeatsByRoomId(room.id),
        })),
      );

      return RoomItemCardCarousel.from({
        roomInfos: allRoomsInfo,
      });
    } catch (error) {
      return err(new UnknownError(error.message));
    }
  }
}
