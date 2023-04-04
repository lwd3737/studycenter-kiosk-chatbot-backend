/* eslint-disable @typescript-eslint/no-namespace */
import { UseCaseError } from './use-case-error';

export type AppError = AppErrors.UnexpectedError;

export namespace AppErrors {
  export class UnexpectedError extends UseCaseError {
    constructor(public metadata: any) {
      super('An unexpected error occurred');
    }
  }
}
