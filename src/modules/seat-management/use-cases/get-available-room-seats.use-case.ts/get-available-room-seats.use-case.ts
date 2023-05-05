import { AppErrors, IUseCase, Result, err, ok } from 'src/core';
import {
  ISeatRepo,
  SeatRepoProvider,
} from '../../domain/seat/seat.repo.interface';
import { Inject } from '@nestjs/common';
import { RoomId } from '../../domain/room/room-id';
import { Seat } from '../../domain/seat/seat.aggregate-root';
import { Room } from '../../domain/room/room.aggregate-root';
import {
  IRoomRepo,
  RoomRepoProvider,
} from '../../domain/room/room.repo.interface';
import {
  GetAvailableRoomSeatsError,
  GetAvailableRoomSeatsErrors,
} from './get-available-room-seats.error';

type UseCaseInput = {
  roomId: string;
};

type UseCaseResult = Result<
  { room: Room; seats: Seat[] },
  GetAvailableRoomSeatsError
>;

export class GetAvailableRoomSeatsUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(
    @Inject(RoomRepoProvider) private roomRepo: IRoomRepo,
    @Inject(SeatRepoProvider) private seatRepo: ISeatRepo,
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const foundRoom = await this.roomRepo.findOneById(
        new RoomId(input.roomId),
      );
      if (foundRoom === null)
        return err(
          new GetAvailableRoomSeatsErrors.RoomNotFoundError(input.roomId),
        );

      const seats = await this.seatRepo.findByRoomId(new RoomId(input.roomId));
      const availableSeats = seats.filter((seat) => seat.isAvailable);

      return ok({ room: foundRoom, seats: availableSeats });
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error as Error));
    }
  }
}
