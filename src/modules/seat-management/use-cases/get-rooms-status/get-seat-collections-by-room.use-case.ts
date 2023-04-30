import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { Room } from '../../domain/room/room.aggregate-root';
import {
  IRoomRepo,
  RoomRepoProvider,
} from '../../domain/room/room.repo.interface';
import { GetSeatCollectionsByRoomError } from './get-seat-collections-by-room.error';
import {
  ISeatRepo,
  SeatRepoProvider,
} from '../../domain/seat/seat.repo.interface';
import { Seat } from '../../domain/seat/seat.aggregate-root';

export type UseCaseResult = Result<
  { room: Room; seats: Seat[] }[],
  GetSeatCollectionsByRoomError
>;

@Injectable()
export class GetSeatCollectionsByRoomUseCase
  implements IUseCase<undefined, UseCaseResult>
{
  constructor(
    @Inject(RoomRepoProvider) private roomRepo: IRoomRepo,
    @Inject(SeatRepoProvider) private seatRepo: ISeatRepo,
  ) {}

  async execute(): Promise<UseCaseResult> {
    try {
      const allRooms = await this.roomRepo.getAll();
      const seatCollectionsByRoom = await Promise.all(
        allRooms.map(async (room) => {
          const seats = await this.seatRepo.getCollectionByIds(room.seatIds);
          return {
            room,
            seats,
          };
        }),
      );
      return ok(seatCollectionsByRoom);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
