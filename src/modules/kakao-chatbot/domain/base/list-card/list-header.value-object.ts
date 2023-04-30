import { ok, Result, ValueObject } from 'src/core';
import { ListItemAction, ListItemProps } from './list-item.value-object';

export type ListHeaderProps = Exclude<ListItemProps, 'description'>;

export class ListHeader extends ValueObject<ListHeaderProps> {
  get title(): string {
    return this.props.title;
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

  protected constructor(props: ListHeaderProps) {
    super(props);
  }

  public static create(props: ListHeaderProps): Result<ListHeader> {
    return ok(new ListHeader(props));
  }
}
