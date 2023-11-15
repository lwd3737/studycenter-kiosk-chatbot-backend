import { IMapper } from 'src/core';
import { Seat } from '../../domain/seat/seat.ar';

export const SeatMapperProvider = Symbol('SeatMapperProvider');

export interface ISeatMapper extends IMapper<Seat> {
  toPersistence(seat: Seat): any;
  toDomain(raw: any): Seat;
}
