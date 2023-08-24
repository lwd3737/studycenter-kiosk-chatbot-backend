/* eslint-disable @typescript-eslint/no-namespace */
import { UseCaseError } from './use-case-error';

// Deprecated
export namespace AppErrors {
  export class UnexpectedError extends UseCaseError {
    constructor(error?: Error) {
      super(`An unexpected error occurred`);
      console.debug(error);
    }
  }
}

export class AppError<
  Metadata extends Record<string, any> = Record<string, any>,
> extends Error {
  private _metadata: Metadata;

  constructor(message: string, metadata?: Metadata) {
    super(message);

    if (metadata) this._metadata = metadata;
  }

  get metadata(): Metadata {
    return this._metadata;
  }
}

export class UnknownError extends AppError {
  constructor(message: string) {
    super(`An unknown error occurred: ${message}`);
  }
}
