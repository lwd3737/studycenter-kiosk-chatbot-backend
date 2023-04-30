import { IRepo } from 'src/core/domain/repo.interface';
import { Seat } from './seat.aggregate-root';
import { SeatIds } from '../room/seat-ids.value-object';

export const SeatRepoProvider = Symbol('SeatRepoProvider');

export interface ISeatRepo extends IRepo<Seat> {
  init(seats: Seat[]): Promise<void>;
  bulkUpdate(seats: Seat[]): Promise<void>;
  getCollectionByIds(seatIds: SeatIds): Promise<Seat[]>;
}
