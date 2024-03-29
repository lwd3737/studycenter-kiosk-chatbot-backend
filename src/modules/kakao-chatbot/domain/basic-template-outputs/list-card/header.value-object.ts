import { ok, Result, ValueObject } from 'src/core';
import { ListCardItemActionEnum, ListCardItemProps } from './item.value-object';

export type ListCardHeaderProps = Exclude<ListCardItemProps, 'description'>;

export class ListCardHeader extends ValueObject<ListCardHeaderProps> {
  get title(): string {
    return this.props.title;
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

  protected constructor(props: ListCardHeaderProps) {
    super(props);
  }

  public static create(props: ListCardHeaderProps): Result<ListCardHeader> {
    return ok(new ListCardHeader(props));
  }
}
