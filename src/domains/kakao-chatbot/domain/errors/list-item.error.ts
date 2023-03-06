import { DomainError } from 'src/core';
import { ListItemProps } from '../list-card';

export type ListItemError = PropsMismatchingActionIncludedError;

class PropsMismatchingActionIncludedError extends DomainError {
  constructor(props: ListItemProps) {
    const { action } = props;
    const extraProps = Object.keys(props).filter((key) => key !== 'action');

    super(
      `ListItem's invalid props (${extraProps}) mismatching action '${action}' is included in list item`,
    );
  }
}

export const ListItemErrors = {
  PropsMismatchingActionIncludedError,
};
