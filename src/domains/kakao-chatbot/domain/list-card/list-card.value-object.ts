import { ok, Result, ValueObject } from 'src/core';
import { Button } from '../button.value-object';
import { ListHeader } from './list-header.value-object';
import { ListItem } from './list-item.value-object';

export interface ListCardProps {
  header: ListHeader;
  items: ListItem[];
  buttons?: Button[];
}

export class ListCard extends ValueObject<ListCardProps> {
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

  public static create(props: ListCardProps): Result<ListCard> {
    return ok(new ListCard(props));
  }
}
