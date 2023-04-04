import { Inject, Injectable } from '@nestjs/common';
import { Room } from '../../../domain/room/room.aggregate-root';
import { IRoomRepo } from '../../../domain/room/room.repo.interface';
import { MockRoom } from '../../mappers/impl/mock-room.mapper';
import {
  IRoomMapper,
  RoomMapperProvider,
} from '../../mappers/room.mapper.interace';

@Injectable()
export class MockRoomRepo implements IRoomRepo {
  private storage: MockRoom[] = [];

  constructor(@Inject(RoomMapperProvider) private roomMapper: IRoomMapper) {}

  public async init(rooms: Room[]): Promise<void> {
    const rawRooms = rooms.map<MockRoom>((room) =>
      this.roomMapper.toPersistence(room),
    );

    this.storage = [...rawRooms];
  }

  public async bulkUpdate(rooms: Room[]): Promise<void> {
    rooms.forEach((room) => {
      const index = this.storage.findIndex((raw) => room.id.equals(raw.id));
      if (index < 0) return;

      this.storage[index] = this.roomMapper.toPersistence(room);
    });
  }

  public async getAll(): Promise<Room[]> {
    return this.storage.map((raw) => this.roomMapper.toDomain(raw));
  }

  public async exist(): Promise<boolean> {
    return this.storage.length > 0;
  }
}
