import { Injectable } from '@nestjs/common';
import { IUseCase, Result, err, ok } from 'src/core';
import { AvailableSeatsListCardCarousel } from 'src/modules/kakao-chatbot/domain/available-seats-list-cards-carousel/available-seats-list-card-carousel.value-object';
import { RoomId } from 'src/modules/seat-management/domain/room/room-id';
import { SeatService } from 'src/modules/seat-management/services/seat.service';
import {
  GetAvailableSeatsInRoomError,
  RoomNotFoundError,
} from './get-available-seats-in-room.error';
import { ListCardCarousel } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/list-card-carousel/list-card-carousel.value-object';
import { CustomConfigService } from 'src/modules/config';

type UseCaseInput = {
  roomId: string;
};
type UseCaseResult = Result<ListCardCarousel[], GetAvailableSeatsInRoomError>;

@Injectable()
export class GetAvailableSeatsInRoomUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(
    private configService: CustomConfigService,
    private seatService: SeatService,
  ) {}

  async execute(input: UseCaseInput) {
    const blockId = this.configService.get(
      'kakao.blockIds.checkInOut.checkIn',
      { infer: true },
    )!;

    const availableRoomInfo = await this.seatService.findRoomInfoByRoomId(
      new RoomId(input.roomId),
    );
    if (availableRoomInfo === null)
      return err(new RoomNotFoundError(input.roomId));

    const carouselsOrError = AvailableSeatsListCardCarousel.createCarousels({
      blockId,
      ...availableRoomInfo,
    });
    if (carouselsOrError.isErr()) return err(carouselsOrError.error);

    return ok(carouselsOrError.value);
  }
}
