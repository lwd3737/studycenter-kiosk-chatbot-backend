import { DomainError } from 'src/core';

/* eslint-disable @typescript-eslint/no-namespace */
export type CommerceCardError = CommerceCardErrors.InvalidThumbnailNumberError;

export namespace CommerceCardErrors {
  export class InvalidThumbnailNumberError extends DomainError {
    constructor() {
      super(`Thumbnail of commerce card number must have only one`);
    }
  }

  export class InvalidButtonNumberError extends DomainError {
    constructor() {
      super('Button of commerce card number must have between 1 and 3');
    }
  }
}
