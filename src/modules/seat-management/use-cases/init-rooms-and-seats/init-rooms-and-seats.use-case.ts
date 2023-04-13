import { Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';

import { Room } from '../../domain/room/room.aggregate-root';

import { Seat } from '../../domain/seat/seat.aggregate-root';
import { SeatManagementSeederService } from '../../infra/seads/seat-management-seeder.service';

import { InitRoomsAndSeatsError } from './init-rooms-and-seats.error';

type UseCaseResult = Result<
  { rooms: Room[]; seats: Seat[] },
  InitRoomsAndSeatsError
>;

@Injectable()
export class InitRoomsAndSeatsUseCase implements IUseCase<null, UseCaseResult> {
  constructor(
    private roomsAndSeatsSeeaderService: SeatManagementSeederService,
  ) {}

  async execute(): Promise<UseCaseResult> {
    try {
      const seedResult = await this.roomsAndSeatsSeeaderService.seed();
      if (seedResult.isErr()) {
        return err(seedResult.error);
      }

      return ok(seedResult.value);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error as Error));
    }
  }
}