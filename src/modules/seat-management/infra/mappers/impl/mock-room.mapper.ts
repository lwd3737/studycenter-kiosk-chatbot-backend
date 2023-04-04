import { Injectable } from '@nestjs/common';
import { combine } from 'src/core';
import { RoomNumber } from 'src/modules/seat-management/domain/room/room-number.value-object';
import { RoomType } from 'src/modules/seat-management/domain/room/room-type.value-object';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { SeatIds } from 'src/modules/seat-management/domain/room/seat-ids.value-object';
import { SeatsInfo } from 'src/modules/seat-management/domain/room/seats-infovalue-object';
import { SeatId } from 'src/modules/seat-management/domain/seat/seat-id';
import { IRoomMapper } from '../room.mapper.interace';

export type MockRoom = {
  id: string;
  title: string;
  type: string;
  number: number;
  seatIds: string[];
  seatsInfo: {
    totalNumber: number;
    availableNumber: number;
  };
};

@Injectable()
export class MockRoomMapper implements IRoomMapper {
  toDomain(raw: MockRoom): Room {
    const roomPropsResult = combine(
      RoomType.create({ value: raw.type }),
      RoomNumber.create({ value: raw.number }),
      SeatsInfo.create({ ...raw.seatsInfo }),
    );
    if (roomPropsResult.isErr()) {
      throw roomPropsResult.error;
    }
    const [roomType, roomNumber, seatsStatus] = roomPropsResult.value;

    const roomResult = Room.createFromExsiting({
      title: raw.title,
      type: roomType,
      number: roomNumber,
      seatIds: SeatIds.create({ ids: raw.seatIds.map((id) => new SeatId(id)) }),
      seatsInfo: seatsStatus,
    });
    if (roomResult.isErr()) {
      throw roomResult.error;
    }

    return roomResult.value;
  }

  toPersistence(domain: Room): MockRoom {
    return {
      id: domain.id.value,
      type: domain.type.value,
      title: domain.title,
      number: domain.number.value,
      seatIds: domain.seatIds.values,
      seatsInfo: {
        totalNumber: domain.seatsInfo.totalNumber,
        availableNumber: domain.seatsInfo.availableNumber,
      },
    };
  }
}
