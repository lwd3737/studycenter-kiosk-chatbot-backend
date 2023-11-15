import { Injectable } from '@nestjs/common';
import { AppErrors, DomainError, IUseCase, Result, err, ok } from 'src/core';
import { AvailableSeatsListCardCarousel } from 'src/modules/kakao-chatbot/domain/available-seats-list-cards-carousel/available-seats-list-card-carousel.value-object';
import { ListCardCarousel } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/list-card-carousel/list-card-carousel.value-object';
import { RoomId } from 'src/modules/seat-management/domain/room/room-id';
import { SeatService } from 'src/modules/seat-management/services/seat.service';
import { RoomNotFoundError } from './get-available-seats-in-room.error';
import { CustomConfigService } from 'src/modules/config';

type UseCaseInput = {
  roomId: string;
};
type UseCaseResult = Result<
  ListCardCarousel[],
  AppErrors.UnexpectedError | DomainError
>;

@Injectable()
export class GetAvailableSeatsInRoomUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(
    private configService: CustomConfigService,
    private seatService: SeatService,
  ) {}

  public async execute(input: UseCaseInput): Promise<UseCaseResult> {
    const blockId = this.configService.get(
      'kakao.blockIds.ticketing.confirmTicketPurchaseInfo',
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
