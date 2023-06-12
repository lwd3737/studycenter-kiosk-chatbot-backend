/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors, UseCaseError } from 'src/core';
import { TicketTime } from 'src/modules/ticketing/domain';

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
