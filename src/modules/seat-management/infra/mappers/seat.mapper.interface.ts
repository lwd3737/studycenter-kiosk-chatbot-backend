import { IMapper } from 'src/core';
import { Seat } from '../../domain/seat/seat.aggregate-root';
import { MockSeat } from '../repos/mocks/mock-seat.repo';

export const SeatMapperProvider = Symbol('SeatMapperProvider');

export interface ISeatMapper extends IMapper<Seat> {
  toPersistence(seat: Seat): MockSeat;
}
