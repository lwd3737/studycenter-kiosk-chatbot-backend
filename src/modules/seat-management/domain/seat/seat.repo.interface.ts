import { IRepo } from 'src/core/domain/repo.interface';
import { Seat } from './seat.aggregate-root';

export const SeatRepoProvider = Symbol('SeatRepoProvider');

export interface ISeatRepo extends IRepo<Seat> {
  init(seats: Seat[]): Promise<void>;
  bulkUpdate(seats: Seat[]): Promise<void>;
}
