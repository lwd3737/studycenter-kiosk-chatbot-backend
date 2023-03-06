import { DomainError } from 'src/core';

export type ListCardError = ButtonMaxCountExeededError;

class ButtonMaxCountExeededError extends DomainError {
  constructor() {
    super(`ListItem's button max count is exceeded`);
  }
}

export const ListCardErrors = {
  ButtonMaxCountExeededError,
};
