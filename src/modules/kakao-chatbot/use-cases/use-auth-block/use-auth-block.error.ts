/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors, DomainError, UseCaseError } from 'src/core';

export type UseAuthBlockError =
  | AppErrors.UnexpectedError
  | UseAuthBlockErrors.AlreadyAuthenticatedError
  | DomainError;

export namespace UseAuthBlockErrors {
  export class AlreadyAuthenticatedError extends UseCaseError {
    constructor() {
      super(`Already authenticated`);
    }
  }
}
