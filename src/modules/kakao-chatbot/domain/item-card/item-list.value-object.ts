import { err, ok, Result, ValueObject } from 'src/core';
import { ItemCardErrors } from './item-card.error';

export interface ItemListProps {
  title: string;
  desciption: string;
}

export class ItemList extends ValueObject<ItemListProps> {
  private static TITLE_MAX_LENGTH = 6;

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.desciption;
  }

  public static create(
    props: ItemListProps,
  ): Result<ItemList, ItemCardErrors.ItemListTitleMaxLengthExceededError> {
    if (this.isTitleMaxLengthExceeded(props.title)) {
      return err(new ItemCardErrors.ItemListTitleMaxLengthExceededError());
    }
    return ok(new ItemList(props));
  }

  private static isTitleMaxLengthExceeded(title: string): boolean {
    return title.length > this.TITLE_MAX_LENGTH;
  }

  private constructor(props: ItemListProps) {
    super(props);
  }
}
