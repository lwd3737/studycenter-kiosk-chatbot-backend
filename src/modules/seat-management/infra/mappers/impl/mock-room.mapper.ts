import { Injectable } from '@nestjs/common';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { IRoomMapper } from '../room.mapper.interace';

export type MockRoom = {
  id: string;
  title: string;
  type: string;
  number: number;
  seatIds: string[];
  seatsInfo: {
    totalCount: number;
    availableCount: number;
  };
};

@Injectable()
export class MockRoomMapper implements IRoomMapper {
  toDomain(raw: MockRoom): Room {
    const roomOrError = Room.createFromExisting(raw, raw.id);
    if (roomOrError.isErr()) {
      throw roomOrError.error;
    }

    return roomOrError.value;
  }

  toPersistence(domain: Room): MockRoom {
    return {
      id: domain.id.value,
      type: domain.type.value,
      title: domain.title,
      number: domain.number.value,
      seatIds: domain.seatIds.values,
      seatsInfo: {
        totalCount: domain.seatsInfo.totalCount,
        availableCount: domain.seatsInfo.availableCount,
      },
    };
  }
}
