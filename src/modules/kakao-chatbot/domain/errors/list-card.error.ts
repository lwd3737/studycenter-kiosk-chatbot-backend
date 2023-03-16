/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';
import { ListItemProps } from '../list-card/list-item.value-object';

export type ListCardError =
  | ListCardErrors.ButtonMaxNumberExeededError
  | ListCardErrors.PropsMismatchingActionIncludedError;

export namespace ListCardErrors {
  export class ButtonMaxNumberExeededError extends DomainError {
    constructor() {
      super(`ListItem's button max count is exceeded`);
    }
  }

  export class PropsMismatchingActionIncludedError extends DomainError {
    constructor(props: ListItemProps) {
      const { action } = props;
      const extraProps = Object.keys(props).filter((key) => key !== 'action');

      super(
        `ListItem's invalid props (${extraProps}) mismatching action '${action}' is included in list item`,
      );
    }
  }
}
