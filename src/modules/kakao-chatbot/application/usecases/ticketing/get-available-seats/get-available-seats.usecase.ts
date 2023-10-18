import { Injectable } from '@nestjs/common';
import { AppErrors, DomainError, IUseCase, Result, err, ok } from 'src/core';
import { AvailableSeatsListCardCarousel } from 'src/modules/kakao-chatbot/domain/available-seats-list-cards-carousel/available-seats-list-card-carousel.value-object';
import { ListCardCarousel } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/list-card-carousel/list-card-carousel.value-object';
import { RoomId } from 'src/modules/seat-management/domain/room/room-id';
import { SeatService } from 'src/modules/seat-management/services/seat.service';
import { RoomNotFoundError } from './get-available-seats.error';

type UseCaseInput = {
  roomId: string;
};
type UseCaseResult = Result<
  ListCardCarousel[],
  AppErrors.UnexpectedError | DomainError
>;

@Injectable()
export class GetAvailableSeatsUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(private seatService: SeatService) {}

  public async execute(input: UseCaseInput): Promise<UseCaseResult> {
    const availableSeatsInfo =
      await this.seatService.findAvailableSeatsInfoByRoomId(
        new RoomId(input.roomId),
      );
    if (availableSeatsInfo === null)
      return err(new RoomNotFoundError(input.roomId));

    const carouselsOrError =
      AvailableSeatsListCardCarousel.createCarousels(availableSeatsInfo);
    if (carouselsOrError.isErr()) return err(carouselsOrError.error);

    return ok(carouselsOrError.value);
  }
}
