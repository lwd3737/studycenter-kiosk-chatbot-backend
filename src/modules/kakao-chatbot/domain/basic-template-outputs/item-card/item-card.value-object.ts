import { DomainError, err, ok, Result, ValueObject } from 'src/core';
import { Button } from '../button/button.value-object';
import { Thumbnail } from '../thumbnail/thumbnail.value-object';
import { ImageTitle } from './image-title.value-object';
import { ItemCardError, ItemCardErrors } from './item-card.error';
import { ItemList } from './item-list.value-object';
import { ItemListSummary } from './item-list-summary.value-object';

export interface ItemCardProps {
  thumbnail?: Thumbnail;
  head?: ItemCardHead;
  imageTitle?: ImageTitle;
  itemList: ItemList[];
  itemListAlignment?: 'left' | 'right';
  itemListSummary?: ItemListSummary;
  title?: string;
  description?: string;
  buttons?: ReadonlyArray<Button>;
  buttonLayout?: 'vertical' | 'horizontal';
}
type ItemCardHead = {
  title: string;
};

export type CreateItemCardProps = ItemCardProps;

export class ItemCard extends ValueObject<ItemCardProps> {
  get thumbnail(): Thumbnail | undefined {
    return this.props.thumbnail;
  }

  get head(): ItemCardHead | undefined {
    return this.props.head;
  }

  get imageTitle(): ImageTitle | undefined {
    return this.props.imageTitle;
  }

  get itemList(): ItemList[] {
    return this.props.itemList;
  }

  get itemListAlignment(): 'left' | 'right' | undefined {
    return this.props.itemListAlignment;
  }

  get itemListSummary(): ItemListSummary | undefined {
    return this.props.itemListSummary;
  }

  get title(): string | undefined {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get buttons(): ReadonlyArray<Button> | undefined {
    return this.props.buttons;
  }

  get buttonLayout(): 'vertical' | 'horizontal' | undefined {
    return this.props.buttonLayout;
  }

  public static create(
    props: CreateItemCardProps,
  ): Result<ItemCard, ItemCardError> {
    const validOrError = this.validate(props);
    if (validOrError.isErr()) {
      return err(validOrError.error);
    }

    return ok(new ItemCard(props));
  }

  private static validate(
    props: CreateItemCardProps,
  ): Result<true, ItemCardError> {
    if (this.areItemListEmpty(props.itemList))
      return err(new ItemCardErrors.ItemListEmptyError());
    if (this.isTitleNotIncludedWhenDescriptionExist(props))
      return err(
        new ItemCardErrors.ItemListTitleNotIncludedWhenDescriptionExistError(),
      );
    if (this.areTitleAndDescriptionMaxLengthExceeded(props))
      return err(
        new ItemCardErrors.ItemListTitleAndDescriptionMaxLengthExceededError(),
      );
    if (props.buttons) {
      const buttonsIsValidOrError = this.isButtonsAndLayoutInvalid({
        buttons: props.buttons,
        buttonLayout: props.buttonLayout,
      });
      if (buttonsIsValidOrError.isErr())
        return err(buttonsIsValidOrError.error);
    }

    return ok(true);
  }

  private static areItemListEmpty(itemList: ItemList[]): boolean {
    return itemList.length === 0;
  }

  private static isTitleNotIncludedWhenDescriptionExist(
    props: Pick<CreateItemCardProps, 'title' | 'description'>,
  ): boolean {
    if (props.description && !props.title) {
      return true;
    }

    return false;
  }

  private static areTitleAndDescriptionMaxLengthExceeded(
    props: Pick<CreateItemCardProps, 'title' | 'description'>,
  ): boolean {
    const { title, description } = props;
    if (!title) return false;

    const titleLength = title.length,
      descriptionLength = description?.length ?? 0;

    return titleLength + descriptionLength > 200;
  }

  private static isButtonsAndLayoutInvalid(props: {
    buttons: readonly Button[];
    buttonLayout?: 'vertical' | 'horizontal';
  }): Result<true, DomainError> {
    if (props.buttons.length > 3)
      return err(
        new DomainError(`[ItemCard]: Buttons count is over maximum number`),
      );
    if (props.buttonLayout) {
      if (props.buttonLayout === 'vertical' && props.buttons.length > 3)
        return err(
          new DomainError(
            `[ItemCard]: Count of vertical layout buttons is over maximum number`,
          ),
        );
      if (props.buttonLayout === 'horizontal' && props.buttons.length > 2)
        return err(
          new DomainError(
            `[ItemCard]: Count of horizontal layout buttons is over maximum number`,
          ),
        );
    }
    return ok(true);
  }

  private constructor(props: ItemCardProps) {
    super(props);
  }
}
