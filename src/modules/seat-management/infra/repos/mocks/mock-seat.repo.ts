import { Inject, Injectable } from '@nestjs/common';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import { ISeatRepo } from 'src/modules/seat-management/domain/seat/seat.repo.interface';
import {
  ISeatMapper,
  SeatMapperProvider,
} from '../../mappers/seat.mapper.interface';
import { SeatIds } from 'src/modules/seat-management/domain/room/seat-ids.value-object';
import { RoomId } from 'src/modules/seat-management/domain/room/room-id';

export type MockSeat = {
  id: string;
  roomId: string;
  roomNumber: number;
  number: number;
  isAvailable: boolean;
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

  public async findByRoomId(roomId: RoomId): Promise<Seat[]> {
    const filtered = this.storage.filter((raw) => roomId.equals(raw.roomId));
    return filtered.map((raw) => this.seatMapper.toDomain(raw));
  }
}
