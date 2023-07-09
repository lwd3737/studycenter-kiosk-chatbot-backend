import { AppErrors, DomainError, UseCaseError } from 'src/core';

export type GetMemberError =
  | AppErrors.UnexpectedError
  | GetMemberErrors.NotFound
  | DomainError;

/* eslint-disable @typescript-eslint/no-namespace */
export namespace GetMemberErrors {
  export class NotFound extends UseCaseError {
    constructor(public memberIdOrAppUserId: string) {
      super(`Member appUserId or id(${memberIdOrAppUserId}) not found`);
    }
  }
}
