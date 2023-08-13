import { Injectable } from '@nestjs/common';
import { DomainError, IUseCase, Result } from 'src/core';
import { ItemCardCarousel } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/item-card-carousel/item-card-carousel.value-object';
import { RoomItemCardCarousel } from 'src/modules/kakao-chatbot/domain/room-item-card-carousel/room-item-card-carousel.value-object';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';

type UseCaseInput = {
  roomSeatsGroup: { room: Room; seats: Seat[] }[];
  ticketing?: {
    ticketId: string;
  };
};

type UseCaseResult = Result<ItemCardCarousel, DomainError>;

@Injectable()
export class RenderRoomItemCardsCarouselUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  execute(input: UseCaseInput): UseCaseResult {
    return RoomItemCardCarousel.createFrom({
      roomSeatsGroup: input.roomSeatsGroup,
      ticketing: input.ticketing,
    });
  }
}
