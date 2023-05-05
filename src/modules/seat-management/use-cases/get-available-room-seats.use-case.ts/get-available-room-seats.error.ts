/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors, DomainError, UseCaseError } from 'src/core';

export type GetAvailableRoomSeatsError =
  | AppErrors.UnexpectedError
  | GetAvailableRoomSeatsErrors.RoomNotFoundError
  | DomainError;

export namespace GetAvailableRoomSeatsErrors {
  export class RoomNotFoundError extends UseCaseError {
    constructor(id: string) {
      super(`Room(id:${id}) not found`);
    }
  }
}
