import { Injectable } from '@nestjs/common';
import { DomainError, IUseCase, Result } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { RoomItemCardsCarousel } from '../../domain/room-item-cards-carousel/room-item-cards-carousel.value-object';
import { Carousel } from '../../domain/base/carousel/carousel.value-object';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';

type UseCaseInput = {
  seatCollectionsByRoom: { room: Room; seats: Seat[] }[];
  ticketing?: boolean;
};

type UseCaseResult = Result<Carousel, DomainError>;

@Injectable()
export class GetRoomItemCardsCarouselUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  execute(input: UseCaseInput): UseCaseResult {
    return RoomItemCardsCarousel.create({
      seatCollectionsByRoom: input.seatCollectionsByRoom,
      ticketing: input.ticketing,
    });
  }
}
