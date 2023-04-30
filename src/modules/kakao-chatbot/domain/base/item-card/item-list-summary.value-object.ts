import { DomainError, Result, ValueObject, err, ok } from 'src/core';
import { ItemCardErrors } from './item-card.error';

export interface ItemListSummaryProps {
  title: string;
  description: string;
}

export class ItemListSummary extends ValueObject<ItemListSummaryProps> {
  private static TITLE_MAX_LENGTH = 6;
  private static DESCRIPTION_MAX_LENGTH = 14;

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  public static create(
    props: ItemListSummaryProps,
  ): Result<ItemListSummary, DomainError> {
    if (this.isTitleMaxLengthExceeded(props.title))
      return err(
        new ItemCardErrors.ItemListSummaryTitleMaxLengthExceededError(),
      );
    if (this.isDescriptionMaxLengthExceeded(props.description))
      return err(
        new ItemCardErrors.ItemListSummaryDescriptionMaxLengthExceededError(),
      );

    return ok(new ItemListSummary(props));
  }

  private static isTitleMaxLengthExceeded(title: string): boolean {
    return title.length > this.TITLE_MAX_LENGTH;
  }

  private static isDescriptionMaxLengthExceeded(description: string): boolean {
    return description.length > this.DESCRIPTION_MAX_LENGTH;
  }

  private constructor(props: ItemListSummaryProps) {
    super(props);
  }
}
