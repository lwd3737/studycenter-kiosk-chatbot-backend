import { Injectable } from '@nestjs/common';
import { AppErrors, DomainError, IUseCase, Result, combine } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import { ListCardCarousel } from '../../domain/base/list-card-carousel/list-card-carousel.value-object';
import { AvailableSeatsListCardCarousel } from '../../domain/available-seats-list-cards-carousel/available-seats-list-card-carousel.value-object';

type UseCaseInput = {
  ticketId: string;
  room: Room;
  seats: Seat[];
};
type UseCaseResult = Result<
  ListCardCarousel[],
  AppErrors.UnexpectedError | DomainError
>;
type CarouselIndex = number;

@Injectable()
export class RenderAvailableSeatsListCardsCarouselUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  private SEATS_MAX_COUNT = 25;

  public execute(input: UseCaseInput): UseCaseResult {
    return this.createCarousels(input);
  }

  private createCarousels(
    input: UseCaseInput,
  ): Result<ListCardCarousel[], DomainError> {
    const carouselCount = Math.ceil(input.seats.length / this.SEATS_MAX_COUNT);

    return combine(
      ...Array(carouselCount)
        .fill(true)
        .map((_, carouselIndex) => {
          const [startIndex, endIndex] = this.calculateCarouselRange(
            input.seats,
            carouselIndex,
          );
          const currentSeats = input.seats.slice(startIndex, endIndex);

          return AvailableSeatsListCardCarousel.createFrom({
            ...input,
            seats: currentSeats,
          });
        }),
    );
  }

  private calculateCarouselRange(
    seats: Seat[],
    index: CarouselIndex,
  ): [number, number] {
    const carouselCount = Math.ceil(seats.length / this.SEATS_MAX_COUNT);

    return [
      index * this.SEATS_MAX_COUNT,
      carouselCount === 1 ? seats.length : (index + 1) * this.SEATS_MAX_COUNT,
    ];
  }
}
