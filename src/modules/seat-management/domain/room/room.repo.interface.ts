import { IRepo } from 'src/core/domain/repo.interface';
import { Room } from './room.aggregate-root';

export const RoomRepoProvider = Symbol('RoomRepoProvider');

export interface IRoomRepo extends IRepo<Room> {
  init(rooms: Room[]): Promise<void>;
  bulkUpdate(rooms: Room[]): Promise<void>;
  exist(): Promise<boolean>;
  getAll(): Promise<Room[]>;
}
