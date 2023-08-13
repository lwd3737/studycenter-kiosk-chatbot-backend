import { err, ok, Result, ValueObject } from 'src/core';
import { ListCardErrors } from './list-card.error';

export interface ListCardItemProps {
  title: string;
  description?: string;
  imageUrl?: string;
  //link?: Link
  action?: ListCardItemActionEnum;
  blockId?: string;
  messageText?: string;
  extra?: Record<string, any>;
}

export enum ListCardItemActionEnum {
  BLOCK = 'block',
  MESSAGE = 'message',
}

export class ListCardItem extends ValueObject<ListCardItemProps> {
  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get action(): ListCardItemActionEnum | undefined {
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

  protected constructor(props: ListCardItemProps) {
    super(props);
  }

  public static create(
    props: ListCardItemProps,
  ): Result<ListCardItem, ListCardErrors.PropsMismatchingActionIncludedError> {
    const validationResult = this.validate(props);

    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new ListCardItem(props));
  }

  protected static validate(
    props: ListCardItemProps,
  ): Result<null, ListCardErrors.PropsMismatchingActionIncludedError> {
    if (this.isInvalidActionDataIncluded(props)) {
      return err(new ListCardErrors.PropsMismatchingActionIncludedError(props));
    }

    return ok(null);
  }

  private static isInvalidActionDataIncluded(
    props: ListCardItemProps,
  ): boolean {
    const { action } = props;

    if (!action) {
      if (props.blockId) return false;
      if (props.messageText) return false;
    }

    switch (action) {
      case ListCardItemActionEnum.BLOCK: {
        if (!props.blockId) return false;
        if (props.messageText) return false;
        return true;
      }

      case ListCardItemActionEnum.MESSAGE: {
        if (props.blockId) return false;
        if (!props.messageText) return false;
        return true;
      }

      default:
        return false;
    }
  }
}
