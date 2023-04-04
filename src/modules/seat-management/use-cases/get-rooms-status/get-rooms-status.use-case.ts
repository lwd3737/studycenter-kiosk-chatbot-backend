import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { Room } from '../../domain/room/room.aggregate-root';
import {
  IRoomRepo,
  RoomRepoProvider,
} from '../../domain/room/room.repo.interface';
import { GetRoomsStatusError } from './get-rooms-status.error';

export type UseCaseResult = Result<Room[], GetRoomsStatusError>;

@Injectable()
export class GetRoomsStatusUseCase
  implements IUseCase<undefined, UseCaseResult>
{
  constructor(@Inject(RoomRepoProvider) private roomRepo: IRoomRepo) {}

  async execute(): Promise<UseCaseResult> {
    try {
      const rooms = await this.roomRepo.getAll();
      return ok(rooms);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
