import { Injectable } from '@nestjs/common';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.ar';
import { MockSeat } from '../../repos/mocks/mock-seat.repo';
import { ISeatMapper } from '../seat.mapper.interface';

@Injectable()
export class MockSeatMapper implements ISeatMapper {
  toPersistence(seat: Seat): MockSeat {
    return {
      id: seat.id.value,
      roomId: seat.roomId.value,
      roomNumber: seat.roomNumber.value,
      number: seat.number.value,
      available: seat.available,
      memberIdInUse: seat.memberIdInUse,
    };
  }

  toDomain(raw: MockSeat): Seat {
    const seatOrError = Seat.from({ ...raw }, raw.id);
    if (seatOrError.isErr()) throw seatOrError.error;
    return seatOrError.value;
  }
}
