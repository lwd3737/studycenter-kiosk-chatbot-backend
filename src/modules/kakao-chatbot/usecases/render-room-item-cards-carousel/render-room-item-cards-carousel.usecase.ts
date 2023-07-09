import { Injectable } from '@nestjs/common';
import { DomainError, IUseCase, Result } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { RoomItemCardCarousel } from '../../domain/room-item-card-carousel/room-item-card-carousel.value-object';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import { ItemCardCarousel } from '../../domain/base/item-card-carousel/item-card-carousel.value-object';

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
