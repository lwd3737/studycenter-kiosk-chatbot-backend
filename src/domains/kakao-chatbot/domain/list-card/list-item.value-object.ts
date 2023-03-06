import { err, ok, Result, Validation, ValueObject } from 'src/core';
import { ListItemError, ListItemErrors } from '../errors';

export interface ListItemProps {
  title: string;
  description?: string;
  imageUrl?: string;
  //link?: Link
  action?: ListItemAction;
  blockId?: string;
  messageText?: string;
  extra?: Record<string, any>;
}

export enum ListItemAction {
  BLOCK = 'block',
  MESSAGE = 'message',
}

export class ListItem extends ValueObject<ListItemProps> {
  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get action(): ListItemAction | undefined {
    return this.props.action;
  }

  get blockId(): string | undefined {
    return this.props.blockId;
  }

  get messageText(): string | undefined {
    return this.props.messageText;
  }

  get extra(): Record<string, any> | undefined {
    return this.props.extra;
  }

  protected constructor(props: ListItemProps) {
    super(props);
  }

  public static create(props: ListItemProps): Result<ListItem, ListItemError> {
    const validationResult = this.validate(props);

    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new ListItem(props));
  }

  protected static validate(props: ListItemProps): Result<null, ListItemError> {
    if (this.isInvalidActionDataIncluded(props)) {
      return err(new ListItemErrors.PropsMismatchingActionIncludedError(props));
    }

    return ok(null);
  }

  private static isInvalidActionDataIncluded(props: ListItemProps): boolean {
    const { action } = props;

    if (!action) {
      if (props.blockId) return false;
      if (props.messageText) return false;
    }

    switch (action) {
      case ListItemAction.BLOCK: {
        if (!props.blockId) return false;
        if (props.messageText) return false;
        return true;
      }

      case ListItemAction.MESSAGE: {
        if (props.blockId) return false;
        if (!props.messageText) return false;
        return true;
      }

      default:
        return false;
    }
  }
}
