/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors, DomainError, UseCaseError } from 'src/core';

export type IssueVirtualAccountError =
  | AppErrors.UnexpectedError
  | DomainError
  | IssueVirtualAccountErrors.MemberNotFound;

export namespace IssueVirtualAccountErrors {
  export class MemberNotFound extends UseCaseError {
    constructor(id: string) {
      super(`Member id(${id}) not found`);
    }
  }

  export class TicketNotFound extends UseCaseError {
    constructor(id: string) {
      super(`Ticket id(${id}) not found`);
    }
  }
}
