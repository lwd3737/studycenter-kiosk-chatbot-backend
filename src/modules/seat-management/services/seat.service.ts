import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomRepo,
  RoomRepoProvider,
} from '../domain/room/room.repo.interface';
import {
  ISeatRepo,
  SeatRepoProvider,
} from '../domain/seat/seat.repo.interface';
import { Room } from '../domain/room/room.aggregate-root';
import { RoomId } from '../domain/room/room-id';
import { Seat } from '../domain/seat/seat.aggregate-root';

@Injectable()
export class SeatService {
  constructor(
    @Inject(RoomRepoProvider) private roomRepo: IRoomRepo,
    @Inject(SeatRepoProvider) private seatRepo: ISeatRepo,
  ) {}

  public async findAllRooms(): Promise<Room[]> {
    return await this.roomRepo.findAll();
  }

  public async findRoomById(roomId: RoomId): Promise<Room | null> {
    return await this.roomRepo.findOneById(roomId);
  }

  public async findSeatsByRoomId(roomId: RoomId): Promise<Seat[]> {
    const foundRoom = await this.roomRepo.findOneById(roomId);
    if (!foundRoom) return [];
    return await this.seatRepo.findByIds(foundRoom.seatIds);
  }

  public async findAvailableSeatsInfoByRoomId(
    roomId: RoomId,
  ): Promise<{ room: Room; seats: Seat[] } | null> {
    const room = await this.findRoomById(roomId);
    if (!room) return null;

    const seats = await this.findSeatsByRoomId(roomId);

    return { room, seats: seats.filter((seat) => seat.isAvailable) };
  }
}
