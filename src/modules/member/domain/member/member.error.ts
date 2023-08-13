/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export namespace MemberErrors {
  export class PhoneNumberOrEmailNotIncludedError extends DomainError {
    constructor() {
      super(`Phone number or email is not included.`);
    }
  }
}
