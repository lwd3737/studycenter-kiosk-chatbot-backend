import { IRepo } from 'src/core/domain/repo.interface';
import { Seat } from './seat.ar';
import { SeatIds } from '../room/seat-ids.value-object';
import { RoomId } from '../room/room-id';
import { SeatId } from './seat-id';

export const SeatRepoProvider = Symbol('SeatRepoProvider');

export interface ISeatRepo extends IRepo<Seat> {
  init(seats: Seat[]): Promise<void>;
  bulkUpdate(seats: Seat[]): Promise<void>;
  findOneById(seatId: SeatId): Promise<Seat | null>;
  findByIds(seatIds: SeatIds): Promise<Seat[]>;
  findByRoomId(roomId: RoomId): Promise<Seat[]>;
  update(seat: Seat): Promise<Seat>;
}
