/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors, DomainError, UseCaseError } from 'src/core';
import { TicketId } from 'src/modules/ticketing/domain';

export type GetTicketError =
  | AppErrors.UnexpectedError
  | GetTicketErrors.NotFound
  | DomainError;

export namespace GetTicketErrors {
  export class NotFound extends UseCaseError {
    constructor(id: string) {
      super(`Ticket id(${id}) not found)`);
    }
  }
}
