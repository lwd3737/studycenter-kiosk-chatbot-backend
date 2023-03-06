import { DomainError } from 'src/core';

export type ButtonError =
  | LabelLengthInvalidError
  | PropsMismatchingActionIncludedError;

class LabelLengthInvalidError extends DomainError {
  constructor(label: string) {
    super(`Button label ${label} length is invlid`);
  }
}

class PropsMismatchingActionIncludedError extends DomainError {
  constructor(action: string) {
    super(`Button data mismatching action '${action}' is included`);
  }
}

export const ButtonErrors = {
  LabelLengthInvalidError,
  PropsMismatchingActionIncludedError,
};
