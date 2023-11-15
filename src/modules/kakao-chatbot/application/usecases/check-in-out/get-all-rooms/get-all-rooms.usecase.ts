import { Injectable } from '@nestjs/common';
import { DomainError, IUseCase, Result, UnknownError, err } from 'src/core';
import { CustomConfigService } from 'src/modules/config';
import { RoomItemCardCarousel } from 'src/modules/kakao-chatbot/domain/room-item-card-carousel/room-item-card-carousel.value-object';
import { SeatService } from 'src/modules/seat-management/services/seat.service';

type UseCaseResult = Result<RoomItemCardCarousel, DomainError>;

@Injectable()
export class GetAllRoomsUseCase implements IUseCase<never, UseCaseResult> {
  constructor(
    private configService: CustomConfigService,
    private seatService: SeatService,
  ) {}

  async execute(): Promise<UseCaseResult> {
    const blockId = this.configService.get(
      'kakao.blockIds.checkInOut.getAvailableSeatsInRoom',
      { infer: true },
    )!;

    try {
      return RoomItemCardCarousel.new({
        blockId,
        rooms: await this.seatService.findAllRoomInfo(),
      });
    } catch (error) {
      return err(new UnknownError(error.message));
    }
  }
}
