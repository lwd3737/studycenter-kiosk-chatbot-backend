/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type SimpleTextError = SimpleTextErrors.TextMaxLengthExceededError;

export namespace SimpleTextErrors {
  export class TextMaxLengthExceededError extends DomainError {
    constructor() {
      super(`Length of SimpleText max text is exceeded`);
    }
  }
}
