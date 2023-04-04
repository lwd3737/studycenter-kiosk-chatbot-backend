import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { combine, DomainError, err, ok, Result } from 'src/core';
import { RoomId } from '../../domain/room/room-id';
import { RoomNumber } from '../../domain/room/room-number.value-object';
import { RoomType } from '../../domain/room/room-type.value-object';
import { Room } from '../../domain/room/room.aggregate-root';
import {
  IRoomRepo,
  RoomRepoProvider,
} from '../../domain/room/room.repo.interface';
import { SeatId } from '../../domain/seat/seat-id';
import { SeatNumber } from '../../domain/seat/seat-number.value-object';
import { Seat } from '../../domain/seat/seat.aggregate-root';
import {
  ISeatRepo,
  SeatRepoProvider,
} from '../../domain/seat/seat.repo.interface';
import { PRESET_ROOMS } from './preset-rooms.data';
import { PRESET_SEATS } from './preset-seats.data';
import { PresetRoom } from './preset.schema';

type SeederResult = Result<{ rooms: Room[]; seats: Seat[] }, DomainError>;

type Associations = Map<string, string[]>;

@Injectable()
export class SeatManagementSeederService implements OnApplicationBootstrap {
  constructor(
    @Inject(RoomRepoProvider) private roomRepo: IRoomRepo,
    @Inject(SeatRepoProvider) private seatRepo: ISeatRepo,
  ) {}

  async onApplicationBootstrap() {
    if ((await this.roomRepo.exist()) === false) {
      const result = await this.seed();

      if (result.isErr()) {
        throw result.error;
      }

      console.info('Seed data created successfully');
    }
  }

  public async seed(): Promise<SeederResult> {
    const associations: Associations = new Map();

    const rooms: Room[] = [];
    const seats: Seat[] = [];

    for (const roomData of PRESET_ROOMS) {
      const roomResult = this.createRoom(roomData);
      if (roomResult.isErr()) {
        return err(roomResult.error);
      }
      const room = roomResult.value;

      rooms.push(room);

      const seatsResult = this.createSeats(roomData.id, room.roomId);
      if (seatsResult.isErr()) {
        return err(seatsResult.error);
      }
      const seats = seatsResult.value;

      seats.push(...seats);

      const seatIds = seats.map((seat) => seat.seatId.value);
      associations.set(room.roomId.value, seatIds);
    }

    await this.init(rooms, seats);
    this.associateAggregates(rooms, associations);
    await this.updateAssociations(rooms);

    return ok({ rooms, seats });
  }

  private createRoom(roomData: PresetRoom): Result<Room, DomainError> {
    const roomPropsResult = combine(
      RoomType.create({ value: roomData.type }),
      RoomNumber.create({ value: roomData.number }),
    );
    if (roomPropsResult.isErr()) {
      return err(roomPropsResult.error);
    }

    const [roomType, roomNumber] = roomPropsResult.value;

    const roomResult = Room.createNew({
      title: roomData.title,
      type: roomType,
      number: roomNumber,
    });
    if (roomResult.isErr()) {
      return err(roomResult.error);
    }
    return ok(roomResult.value);
  }

  private createSeats(
    presetRoomId: string,
    roomId: RoomId,
  ): Result<Seat[], DomainError> {
    const seatsDataByRoomId = PRESET_SEATS.filter(
      (seatData) => seatData.roomId === presetRoomId,
    );

    const seatResults = seatsDataByRoomId.map((seatData) => {
      const seatNumberResult = SeatNumber.create({ value: seatData.number });

      if (seatNumberResult.isErr()) {
        return err(seatNumberResult.error);
      }

      return ok(
        Seat.createNew({
          roomId: roomId,
          number: seatNumberResult.value,
        }),
      );
    });

    return combine(...seatResults);
  }

  private async init(rooms: Room[], seats: Seat[]): Promise<void> {
    await this.roomRepo.init(rooms);
    await this.seatRepo.init(seats);
  }

  private associateAggregates(rooms: Room[], associations: Associations): void {
    rooms.forEach((room) => {
      const rawSeatIds = associations.get(room.roomId.value);
      if (!rawSeatIds) {
        throw new Error(
          `Seat ids for associating room(${JSON.stringify(
            room,
            null,
            2,
          )}) does not exist`,
        );
      }

      room.addSeatIds(...rawSeatIds.map((id) => new SeatId(id)));
    });
  }

  private async updateAssociations(rooms: Room[]) {
    await this.roomRepo.bulkUpdate(rooms);
  }
}
