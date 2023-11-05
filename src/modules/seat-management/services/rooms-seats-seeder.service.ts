import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, combine, DomainError, err, ok, Result } from 'src/core';
import { Room } from '../domain/room/room.aggregate-root';
import {
  IRoomRepo,
  RoomRepoProvider,
} from '../domain/room/room.repo.interface';
import { Seat } from '../domain/seat/seat.aggregate-root';
import {
  ISeatRepo,
  SeatRepoProvider,
} from '../domain/seat/seat.repo.interface';
import roomsData from '../infra/seads/rooms.data.json';
import seatsData from '../infra/seads/seats.data.json';

type SeederResult = Result<{ rooms: Room[]; seats: Seat[] }, DomainError>;

@Injectable()
export class RoomsSeatsSeederService {
  constructor(
    @Inject(RoomRepoProvider) private roomRepo: IRoomRepo,
    @Inject(SeatRepoProvider) private seatRepo: ISeatRepo,
  ) {}

  public async execute(): Promise<void> {
    if ((await this.roomRepo.exist()) === false) {
      const seedOrError = await this.seed();
      if (seedOrError.isErr()) {
        throw seedOrError.error;
      }

      console.info('room seeding successfully');
    }
  }

  public async seed(): Promise<SeederResult> {
    try {
      const roomsOrError = await this.createAllRooms();
      if (roomsOrError.isErr()) return err(roomsOrError.error);
      const rooms = roomsOrError.value;

      const seatsOrError = await this.createSeats(rooms);
      if (seatsOrError.isErr()) {
        return err(seatsOrError.error);
      }

      await this.roomRepo.bulkUpdate(rooms);

      return ok({ rooms, seats: seatsOrError.value });
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error as Error));
    }
  }

  private async createAllRooms(): Promise<Result<Room[], DomainError>> {
    const rooms: Room[] = [];
    for (const roomIndex in roomsData) {
      const roomOrError = this.createRoom(roomsData[roomIndex]);
      if (roomOrError.isErr()) {
        return err(roomOrError.error);
      }

      rooms.push(roomOrError.value);
    }

    await this.roomRepo.init(rooms);

    return ok(rooms);
  }

  private createRoom(roomData: {
    title: string;
    type: string;
    number: number;
  }): Result<Room, DomainError> {
    const roomOrError = Room.createNew(roomData);
    if (roomOrError.isErr()) {
      return err(roomOrError.error);
    }
    return ok(roomOrError.value);
  }

  private async createSeats(
    rooms: Room[],
  ): Promise<Result<Seat[], DomainError>> {
    const seats: Seat[] = [];
    for (const room of rooms) {
      const filtered = seatsData.filter(
        (seatData) => seatData.roomNumber === room.number.value,
      );

      const newSeatsOrError = combine(
        ...filtered.map((seatData) =>
          Seat.createNew({ ...seatData, roomId: room.id.value }),
        ),
      );
      if (newSeatsOrError.isErr()) return err(newSeatsOrError.error);
      const newSeats = newSeatsOrError.value;

      seats.push(...newSeats);

      const addSeatsOrError = room.addSeats(...newSeats);
      if (addSeatsOrError.isErr()) return err(addSeatsOrError.error);
    }

    await this.seatRepo.init(seats);

    return ok(seats);
  }
}
