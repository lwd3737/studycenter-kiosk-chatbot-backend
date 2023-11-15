import { AppError, DomainError, UnknownError } from 'src/core';

export type GetAvailableSeatsInRoomError =
  | UnknownError
  | DomainError
  | RoomNotFoundError;

export class RoomNotFoundError extends AppError {
  constructor(roomId: string) {
    super(`Room with id ${roomId} not found`);
  }
}
