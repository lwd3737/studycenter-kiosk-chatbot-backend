import { AppError, DomainError, UnknownError } from 'src/core';

export type DepositCallbackError =
  | UnknownError
  | GetResoucesError
  | DepositFailed
  | EventApiPublishFailed
  | DomainError;

export type GetResoucesError =
  | PaymentNotFoundError
  | SecretNotMatchError
  | MemberNotFoundError
  | TicketNotFoundError
  | SeatNotFoundError
  | GetTicketingContextError;

export type GetTicketingContextError =
  | TicketNotSelectedError
  | SeatNotSelectedError
  | EventApiPublishFailed;

export class SecretNotMatchError extends AppError {
  constructor() {
    super(`Secret not match for deposit callback`);
  }
}

export class DepositFailed extends AppError {
  constructor() {
    super(`Virtual account deposit failed for deposit callback`);
  }
}

export class TicketNotSelectedError extends AppError {
  constructor() {
    super(`Ticket not selected for deposit callback`);
  }
}

export class SeatNotSelectedError extends AppError {
  constructor() {
    super(`Seat not selected for deposit callback`);
  }
}

export class MemberNotFoundError extends AppError<{
  memberId: string;
}> {
  constructor(memberId: string) {
    super(`Member not found with memberId(${memberId}) for deposit callback`, {
      memberId,
    });
  }
}

export class PaymentNotFoundError extends AppError<{
  orderId: string;
}> {
  constructor(orderId: string) {
    super(`Payment not found with orderId(${orderId}) for deposit callback`, {
      orderId,
    });
  }
}

export class TicketNotFoundError extends AppError<{
  ticketId: string;
}> {
  constructor(ticketId: string) {
    super(`Ticket not found with ticketId(${ticketId}) for deposit callback`, {
      ticketId,
    });
  }
}

export class SeatNotFoundError extends AppError<{
  seatId: string;
}> {
  constructor(seatId: string) {
    super(`Seat not found with seatId(${seatId}) for deposit callback`, {
      seatId,
    });
  }
}

export class EventApiPublishFailed extends AppError {
  constructor(message: string) {
    super(`EventApiService publish error for deposit callback: ${message}`);
  }
}
