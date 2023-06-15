import { err, ok, Result, ValueObject } from 'src/core';
import { ListCardErrors } from './list-card.error';

export interface ListItemProps {
  title: string;
  description?: string;
  imageUrl?: string;
  //link?: Link
  action?: ListItemActionEnum;
  blockId?: string;
  messageText?: string;
  extra?: Record<string, any>;
}

export enum ListItemActionEnum {
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

  get action(): ListItemActionEnum | undefined {
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

  public static create(
    props: ListItemProps,
  ): Result<ListItem, ListCardErrors.PropsMismatchingActionIncludedError> {
    const validationResult = this.validate(props);

    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new ListItem(props));
  }

  protected static validate(
    props: ListItemProps,
  ): Result<null, ListCardErrors.PropsMismatchingActionIncludedError> {
    if (this.isInvalidActionDataIncluded(props)) {
      return err(new ListCardErrors.PropsMismatchingActionIncludedError(props));
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
      case ListItemActionEnum.BLOCK: {
        if (!props.blockId) return false;
        if (props.messageText) return false;
        return true;
      }

      case ListItemActionEnum.MESSAGE: {
        if (props.blockId) return false;
        if (!props.messageText) return false;
        return true;
      }

      default:
        return false;
    }
  }
}
