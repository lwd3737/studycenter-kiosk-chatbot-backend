import { Inject, Injectable } from '@nestjs/common';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.ar';
import { ISeatRepo } from 'src/modules/seat-management/domain/seat/seat.repo.interface';
import {
  ISeatMapper,
  SeatMapperProvider,
} from '../../mappers/seat.mapper.interface';
import { SeatIds } from 'src/modules/seat-management/domain/room/seat-ids.value-object';
import { RoomId } from 'src/modules/seat-management/domain/room/room-id';
import { SeatId } from 'src/modules/seat-management/domain/seat/seat-id';
import { RepoError } from 'src/core';

export type MockSeat = {
  id: string;
  roomId: string;
  roomNumber: number;
  number: number;
  available: boolean;
  memberIdInUse: string | null;
};

@Injectable()
export class MockSeatRepo implements ISeatRepo {
  private storage: MockSeat[] = [];

  constructor(@Inject(SeatMapperProvider) private seatMapper: ISeatMapper) {}

  public async init(seats: Seat[]): Promise<void> {
    const rawSeats = seats.map<MockSeat>((seat) =>
      this.seatMapper.toPersistence(seat),
    );

    this.storage = [...rawSeats];
  }

  public async bulkUpdate(seats: Seat[]): Promise<void> {
    const rawsToUpdate = seats.map((seat) =>
      this.seatMapper.toPersistence(seat),
    );

    this.storage.map((raw) => {
      const index = rawsToUpdate.findIndex((_raw) => _raw.id === raw.id);
      if (index < 0) {
        return raw;
      }

      return {
        ...rawsToUpdate[index],
      };
    });
  }

  public async findByIds(seatIds: SeatIds): Promise<Seat[]> {
    const filtered = this.storage.filter((raw) =>
      seatIds.values.includes(raw.id),
    );
    return filtered.map((raw) => this.seatMapper.toDomain(raw));
  }

  public async findOneById(seatId: SeatId): Promise<Seat | null> {
    const found = this.storage.find((raw) => seatId.equals(raw.id));
    return found ? this.seatMapper.toDomain(found) : null;
  }

  public async findByRoomId(roomId: RoomId): Promise<Seat[]> {
    const filtered = this.storage.filter((raw) => roomId.equals(raw.roomId));
    return filtered.map((raw) => this.seatMapper.toDomain(raw));
  }

  public async update(seat: Seat): Promise<Seat> {
    const rawToUpdate = this.seatMapper.toPersistence(seat);

    const index = this.storage.findIndex((raw) => raw.id === rawToUpdate.id);
    if (index < 0) {
      throw new RepoError(`Seat not found with id(${rawToUpdate.id})`);
    }

    this.storage[index] = rawToUpdate;

    return seat;
  }
}
