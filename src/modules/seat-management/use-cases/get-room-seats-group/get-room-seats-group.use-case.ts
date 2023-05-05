import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { Room } from '../../domain/room/room.aggregate-root';
import {
  IRoomRepo,
  RoomRepoProvider,
} from '../../domain/room/room.repo.interface';
import { GetRoomSeatsGroupError } from './get-room-seats-group.error';
import {
  ISeatRepo,
  SeatRepoProvider,
} from '../../domain/seat/seat.repo.interface';
import { Seat } from '../../domain/seat/seat.aggregate-root';

export type UseCaseResult = Result<
  { room: Room; seats: Seat[] }[],
  GetRoomSeatsGroupError
>;

@Injectable()
export class GetRoomSeatsGroupUseCase
  implements IUseCase<undefined, UseCaseResult>
{
  constructor(
    @Inject(RoomRepoProvider) private roomRepo: IRoomRepo,
    @Inject(SeatRepoProvider) private seatRepo: ISeatRepo,
  ) {}

  async execute(): Promise<UseCaseResult> {
    try {
      const allRooms = await this.roomRepo.findAll();
      const roomSeatsGroup = await Promise.all(
        allRooms.map(async (room) => {
          const seats = await this.seatRepo.findByIds(room.seatIds);
          return {
            room,
            seats,
          };
        }),
      );
      return ok(roomSeatsGroup);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
