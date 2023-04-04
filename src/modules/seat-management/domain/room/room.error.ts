/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type RoomError =
  | RoomErrors.SeatsTotalNumberNotEqualsSeatIdsNumberError
  | RoomErrors.RoomNumberNotPositiveIntegerError
  | RoomErrors.SeatsTotalNumberNotIntegerOrNegativeNumberError
  | RoomErrors.SeatsAvailableNumberNotIntegerOrNagativeNumberError
  | RoomErrors.SeatsAvailableNumberExceededTotalNumberError;

export namespace RoomErrors {
  export class SeatsTotalNumberNotEqualsSeatIdsNumberError extends DomainError {
    constructor() {
      super(`Total number of seats is not equals length of seat ids`);
    }
  }

  export class RoomNumberNotPositiveIntegerError extends DomainError {
    constructor(value: any) {
      super(`Room number (${value}) is not positive integer`);
    }
  }

  export class RoomTypeInValidError extends DomainError {
    constructor(value: string) {
      super(`Room type(${value}) is invalid`);
    }
  }

  export class SeatsTotalNumberNotIntegerOrNegativeNumberError extends DomainError {
    constructor(value: any) {
      super(`Total number of seats (${value}) is not positive integer`);
    }
  }

  export class SeatsAvailableNumberNotIntegerOrNagativeNumberError extends DomainError {
    constructor(value: any) {
      super(`Number of available seats (${value}) is not positive integer`);
    }
  }

  export class SeatsAvailableNumberExceededTotalNumberError extends DomainError {
    constructor() {
      super(
        `Number of available seats must be less than total number of seats`,
      );
    }
  }
}
