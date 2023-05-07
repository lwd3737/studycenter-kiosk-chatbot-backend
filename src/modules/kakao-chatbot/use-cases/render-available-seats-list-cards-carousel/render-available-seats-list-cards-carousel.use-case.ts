import { Injectable } from '@nestjs/common';
import { AppErrors, DomainError, IUseCase, Result, combine } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import { AvailableSeatsListCardsCarousel } from '../../domain/available-seats-list-cards-carousel/available-seats-list-cards-carousel.value-object';
import { Carousel } from '../../domain/base/carousel/carousel.value-object';

type UseCaseInput = {
  ticketId: string;
  room: Room;
  seats: Seat[];
};

type UseCaseResult = Result<
  Carousel[],
  AppErrors.UnexpectedError | DomainError
>;

@Injectable()
export class RenderAvailableSeatsListCardsCarouselUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  public execute(input: UseCaseInput): UseCaseResult {
    return this.createCarousels(input);
  }

  private createCarousels(
    input: UseCaseInput,
  ): Result<Carousel[], DomainError> {
    const SEATS_MAX_COUNT = 25;
    const carouselCount = Math.ceil(input.seats.length / SEATS_MAX_COUNT);

    return combine(
      ...Array(carouselCount)
        .fill(true)
        .map((_, index) => {
          const startIndex = index * SEATS_MAX_COUNT;
          const endIndex =
            carouselCount === 1
              ? input.seats.length
              : (index + 1) * SEATS_MAX_COUNT;

          const curSeats = input.seats.slice(startIndex, endIndex);

          return AvailableSeatsListCardsCarousel.create({
            ...input,
            seats: curSeats,
          });
        }),
    );
  }
}
