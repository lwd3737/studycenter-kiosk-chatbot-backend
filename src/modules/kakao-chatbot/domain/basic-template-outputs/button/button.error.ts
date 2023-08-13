import { DomainError } from 'src/core';

export type ButtonError =
  | ButtonErrors.LabelLengthInvalidError
  | ButtonErrors.ActionContainsInvalidDataError;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ButtonErrors {
  export class LabelLengthInvalidError extends DomainError {
    constructor(label: string) {
      super(`Button label(${label}) length is invlid`);
    }
  }

  export class ActionContainsInvalidDataError extends DomainError {
    constructor(action: string) {
      super(`Button action(${action}) contains invalid data`);
    }
  }
}
