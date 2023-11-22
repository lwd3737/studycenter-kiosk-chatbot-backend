import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomRepo,
  RoomRepoProvider,
} from '../domain/room/room.repo.interface';
import {
  ISeatRepo,
  SeatRepoProvider,
} from '../domain/seat/seat.repo.interface';
import { Room } from '../domain/room/room.aggregate-root';
import { RoomId } from '../domain/room/room-id';
import { Seat } from '../domain/seat/seat.ar';
import { SeatId } from '../domain/seat/seat-id';
import { AppError, DomainError, RepoError, Result, err, ok } from 'src/core';

type RoomInfo = {
  room: Room;
  seats: Seat[];
};

@Injectable()
export class SeatService {
  constructor(
    @Inject(RoomRepoProvider) private roomRepo: IRoomRepo,
    @Inject(SeatRepoProvider) private seatRepo: ISeatRepo,
  ) {}

  public async findAllRooms(): Promise<Room[]> {
    return await this.roomRepo.findAll();
  }

  public async findRoomByRoomId(roomId: RoomId): Promise<Room | null> {
    return await this.roomRepo.findOneById(roomId);
  }

  public async findSeatsByRoomId(roomId: RoomId): Promise<Seat[]> {
    const foundRoom = await this.roomRepo.findOneById(roomId);
    if (!foundRoom) return [];
    return await this.seatRepo.findByIds(foundRoom.seatIds);
  }

  public async findAllRoomInfo(): Promise<RoomInfo[]> {
    const allRooms = await this.findAllRooms();
    const seatsByRoom = await Promise.all(
      allRooms.map((room) => this.findRoomInfoByRoomId(room.id)),
    );

    return seatsByRoom.filter((s) => s !== null) as RoomInfo[];
  }

  public async findRoomInfoByRoomId(roomId: RoomId): Promise<RoomInfo | null> {
    const room = await this.findRoomByRoomId(roomId);
    if (!room) return null;

    const seats = await this.findSeatsByRoomId(roomId);

    return { room, seats: seats.filter((seat) => seat.available) };
  }

  public async findSeatInfoById(
    seatId: SeatId,
  ): Promise<{ room: Room; seat: Seat } | null> {
    const foundSeat = await this.seatRepo.findOneById(seatId);
    if (!foundSeat) return null;

    const foundRoom = await this.roomRepo.findOneById(foundSeat.roomId);
    if (!foundRoom)
      throw new RepoError(`Room with id(${seatId.value}) not found`);

    return { room: foundRoom, seat: foundSeat };
  }

  public async assignSeatToMember(
    memberId: string,
    seatId: string,
  ): Promise<Result<true, DomainError | AppError>> {
    const found = await this.seatRepo.findOneById(new SeatId(seatId));
    if (!found) return err(new AppError(`Seat with id${seatId} not found`));

    const assignedOrError = found.assignToMember(memberId);
    if (assignedOrError.isErr()) return err(assignedOrError.error);

    try {
      await this.seatRepo.update(found);
    } catch (err) {
      return err(new RepoError(err.message));
    }

    return ok(true);
  }

  public async unassignSeatFromMember(
    seatId: string,
  ): Promise<Result<{ memberId: string }, DomainError | RepoError>> {
    const found = await this.seatRepo.findOneById(new SeatId(seatId));
    if (!found) return err(new AppError(`Seat with id${seatId} not found`));

    const unassignedOrError = found.unassignSeatFromMember();
    if (unassignedOrError.isErr()) return err(unassignedOrError.error);

    try {
      await this.seatRepo.update(found);
    } catch (err) {
      return err(new RepoError(err.message));
    }

    return ok({ memberId: unassignedOrError.value.memberId });
  }
}
