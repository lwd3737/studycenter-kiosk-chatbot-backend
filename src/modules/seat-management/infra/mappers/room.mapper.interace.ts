import { IMapper } from 'src/core';
import { Room } from '../../domain/room/room.aggregate-root';

export const RoomMapperProvider = Symbol('RoomMapperProvider');

export interface IRoomMapper extends IMapper<Room> {
  toPersistence(domain: Room): any;
  toDomain(raw: any): Room;
}
