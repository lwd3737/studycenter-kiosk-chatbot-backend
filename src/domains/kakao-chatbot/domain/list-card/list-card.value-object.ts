import { err, ok, Result, ValueObject } from 'src/core';
import { Button } from '../button.value-object';
import { ListCardError, ListCardErrors } from '../errors';
import { ListHeader } from './list-header.value-object';
import { ListItem } from './list-item.value-object';

export interface ListCardProps {
  header: ListHeader;
  items: ListItem[];
  buttons?: Button[];
}

export class ListCard extends ValueObject<ListCardProps> {
  private static BUTTON_MAX_COUNT = 2;

  get header(): ListHeader {
    return this.props.header;
  }

  get items(): ListItem[] {
    return this.props.items;
  }

  get buttons(): Button[] | undefined {
    return this.props.buttons;
  }

  protected constructor(props: ListCardProps) {
    super(props);
  }

  public static create(props: ListCardProps): Result<ListCard, ListCardError> {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new ListCard(props));
  }

  protected static validate(props: ListCardProps): Result<null, ListCardError> {
    if (this.isButtonMaxCountExceeded(props.buttons)) {
      return err(new ListCardErrors.ButtonMaxCountExeededError());
    }

    return ok(null);
  }

  private static isButtonMaxCountExceeded(buttons?: Button[]): boolean {
    if (buttons) {
      return buttons.length > this.BUTTON_MAX_COUNT;
    }

    return false;
  }
}
