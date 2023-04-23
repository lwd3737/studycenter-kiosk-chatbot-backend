import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { combine, DomainError, err, ok, Result } from 'src/core';
import { RoomId } from '../../domain/room/room-id';
import { Room } from '../../domain/room/room.aggregate-root';
import {
  IRoomRepo,
  RoomRepoProvider,
} from '../../domain/room/room.repo.interface';
import { Seat } from '../../domain/seat/seat.aggregate-root';
import {
  ISeatRepo,
  SeatRepoProvider,
} from '../../domain/seat/seat.repo.interface';
import roomsData from './rooms.data.json';
import seatsData from './seats.data.json';
import { PresetRoom } from './seeds.schema';

type SeederResult = Result<{ rooms: Room[]; seats: Seat[] }, DomainError>;

type Associations = Map<string, string[]>;

@Injectable()
export class RoomsSeatsSeederService implements OnApplicationBootstrap {
  constructor(
    @Inject(RoomRepoProvider) private roomRepo: IRoomRepo,
    @Inject(SeatRepoProvider) private seatRepo: ISeatRepo,
  ) {}

  async onApplicationBootstrap() {
    if ((await this.roomRepo.exist()) === false) {
      const seedOrError = await this.seed();

      if (seedOrError.isErr()) {
        throw seedOrError.error;
      }

      console.info('Seed data created successfully');
    }
  }

  public async seed(): Promise<SeederResult> {
    const associations: Associations = new Map();

    const rooms: Room[] = [];
    const seats: Seat[] = [];

    for (const roomIndex in roomsData) {
      const roomOrError = this.createRoom(roomsData[roomIndex]);
      if (roomOrError.isErr()) {
        return err(roomOrError.error);
      }
      const room = roomOrError.value;

      rooms.push(room);

      const seatsOrError = this.createSeats(
        roomsData[roomIndex].id,
        room.roomId,
      );
      if (seatsOrError.isErr()) {
        return err(seatsOrError.error);
      }
      const newSeats = seatsOrError.value;
      seats.push(...newSeats);

      const newSeatIds = newSeats.map((seat) => seat.seatId.value);
      associations.set(room.roomId.value, newSeatIds);
    }

    await this.init(rooms, seats);
    this.associateAggregates({ rooms, seats }, associations);
    await this.updateAssociations(rooms);

    return ok({ rooms, seats });
  }

  private createRoom(roomData: PresetRoom): Result<Room, DomainError> {
    const roomOrError = Room.createNew(roomData);
    if (roomOrError.isErr()) {
      return err(roomOrError.error);
    }
    return ok(roomOrError.value);
  }

  private createSeats(
    presetRoomId: string,
    roomId: RoomId,
  ): Result<Seat[], DomainError> {
    const seatsDataByRoomId = seatsData.filter(
      (seatData) => seatData.roomId === presetRoomId,
    );

    const seatOrErrors = seatsDataByRoomId.map((seatData) =>
      Seat.createNew({ ...seatData, roomId: roomId.value }),
    );

    return combine(...seatOrErrors);
  }

  private async init(rooms: Room[], seats: Seat[]): Promise<void> {
    await this.roomRepo.init(rooms);
    await this.seatRepo.init(seats);
  }

  private associateAggregates(
    aggregates: { rooms: Room[]; seats: Seat[] },
    associations: Associations,
  ): void {
    aggregates.rooms.forEach((room) => {
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

      const seatsByRoomId = aggregates.seats.filter((seat) =>
        seat.roomId.equals(room.roomId.value),
      );

      const addSeatsOrError = room.addSeat(...seatsByRoomId);
      if (addSeatsOrError.isErr()) {
        throw addSeatsOrError.error;
      }
    });
  }

  private async updateAssociations(rooms: Room[]) {
    await this.roomRepo.bulkUpdate(rooms);
  }
}
