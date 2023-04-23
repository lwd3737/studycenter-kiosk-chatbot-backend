/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors, DomainError, UseCaseError } from 'src/core';

export type SignupError =
  | AppErrors.UnexpectedError
  | SignupErrors.AlreadySignedupError
  | DomainError;

export namespace SignupErrors {
  export class AlreadySignedupError extends UseCaseError {
    constructor() {
      super('Already authenticated');
    }
  }
}
