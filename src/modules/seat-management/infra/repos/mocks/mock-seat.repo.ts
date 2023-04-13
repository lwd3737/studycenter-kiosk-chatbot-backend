import { Inject, Injectable } from '@nestjs/common';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import { ISeatRepo } from 'src/modules/seat-management/domain/seat/seat.repo.interface';
import {
  ISeatMapper,
  SeatMapperProvider,
} from '../../mappers/seat.mapper.interface';

export type MockSeat = {
  id: string;
  roomId: string;
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
}