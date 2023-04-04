/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type SeatError = SeatErrors.NumberNotPositiveIntegerError;

export namespace SeatErrors {
  export class NumberNotPositiveIntegerError extends DomainError {
    constructor(value: any) {
      super(`Seat number (${value}) it not positive integer`);
    }
  }
}
