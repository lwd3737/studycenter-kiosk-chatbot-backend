import { DomainError, UnknownError, UseCaseError } from 'src/core';

export type CheckInErrors =
  | DomainError
  | UnknownError
  | MyTicketNotFoundError
  | SeatNotFoundError;

export class MyTicketNotFoundError extends UseCaseError {
  constructor(id: string) {
    super(`MyTicket with id(${id}) not found`);
  }
}

export class SeatNotFoundError extends UseCaseError {
  constructor(id: string) {
    super(`Seat with id(${id}) not found`);
  }
}
