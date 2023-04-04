import { Injectable } from '@nestjs/common';
import { DomainError, err, IUseCase, ok, Result } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { Carousel } from '../../domain/carousel/carousel.value-object';
import { ContextControl } from '../../domain/context-control/context-control.value-object';
import { ContextValue } from '../../domain/context-control/context-value.value-object';
import { RoomItemCardsCarousel } from '../../domain/rooms-item-card-carousel/room-item-cards-carousel.value-object';

type UseCaseInput = {
  rooms: Room[];
};

type UseCaseResult = Result<Carousel, DomainError>;

@Injectable()
export class GetRoomItemCardsCarouselUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  execute(input: UseCaseInput): UseCaseResult {
    return RoomItemCardsCarousel.create({ rooms: input.rooms });
  }
}
