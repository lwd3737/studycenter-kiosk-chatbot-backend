/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors, UseCaseError } from 'src/core';
import { TicketTime } from '../../domain/ticket/ticket-time.value-object';

export type GetTicketByTimeError =
  | AppErrors.UnexpectedError
  | GetTicketByTimeErrors.TicketNotFoundError;

export namespace GetTicketByTimeErrors {
  export class TicketNotFoundError extends UseCaseError {
    constructor(time: TicketTime) {
      super(
        `TicketTime unit '${time.unit}' and value '${time.value}' not found`,
      );
    }
  }
}
