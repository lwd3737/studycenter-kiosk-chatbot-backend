import { IRepo } from 'src/core/domain/repo.interface';
import { Seat } from './seat.aggregate-root';
import { SeatIds } from '../room/seat-ids.value-object';
import { RoomId } from '../room/room-id';

export const SeatRepoProvider = Symbol('SeatRepoProvider');

export interface ISeatRepo extends IRepo<Seat> {
  init(seats: Seat[]): Promise<void>;
  bulkUpdate(seats: Seat[]): Promise<void>;
  findByIds(seatIds: SeatIds): Promise<Seat[]>;
  findByRoomId(roomId: RoomId): Promise<Seat[]>;
}
