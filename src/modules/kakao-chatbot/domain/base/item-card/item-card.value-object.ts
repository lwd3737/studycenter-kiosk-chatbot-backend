import { err, ok, Result, ValueObject } from 'src/core';
import { Button } from '../button/button.value-object';
import { Thumbnail } from '../thumbnail/thumbnail.value-object';
import { ImageTitle } from './image-title.value-object';
import { ItemCardHead } from './item-card-head.value-object';
import { ItemCardError, ItemCardErrors } from './item-card.error';
import { ItemList } from './item-list.value-object';
import { ItemListSummary } from './item-list-summary.value-object';

export interface ItemCardProps {
  thumbnail?: Thumbnail;
  head?: ItemCardHead;
  // profile: ItemCardProfile
  imageTitle?: ImageTitle;
  itemList: ItemList[];
  itemListAlignment?: 'left' | 'right';
  itemListSummary?: ItemListSummary;
  title?: string;
  description?: string;
  buttons?: ReadonlyArray<Button>;
  buttonLayout?: 'vertical' | 'horizontal';
}

export interface CreateProps extends ItemCardProps {
  isCarousel: boolean;
}

export class ItemCard extends ValueObject<ItemCardProps> {
  private static TITLE_DESCRIPTION_MAX_LENGTH_IN_SINGLE_TYPE = 200;
  private static TITLE_DESCRIPTION_MAX_LENGTH_IN_CAROUSEL_TYPE = 100;
  private static BUTTON_MAX_NUMBER_WHEN_LAYOUT_HOTIZONTAL = 3;
  private static BUTTON_MAX_NUMBER_WHEN_LAYOUT_VERTICAL = 2;

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

  public static create(props: CreateProps): Result<ItemCard, ItemCardError> {
    const validOrError = this.validate(props);
    if (validOrError.isErr()) {
      return err(validOrError.error);
    }

    return ok(new ItemCard(props));
  }

  private static validate(props: CreateProps): Result<null, ItemCardError> {
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
    if (this.isButtonsMaxNumberExceededWhenLayoutVertical(props))
      return err(
        new ItemCardErrors.ButtonsMaxNumberExceededWhenLayoutVerticalError(),
      );
    if (this.isButtonsMaxNumberExceededWhenLayoutHorizontal(props))
      return err(
        new ItemCardErrors.ButtonsMaxNumberExceededWhenLayoutHorizontalError(),
      );
    return ok(null);
  }

  private static areItemListEmpty(itemList: ItemList[]): boolean {
    return itemList.length === 0;
  }

  private static isTitleNotIncludedWhenDescriptionExist(
    props: Pick<CreateProps, 'title' | 'description'>,
  ): boolean {
    if (props.description && !props.title) {
      return true;
    }

    return false;
  }

  private static areTitleAndDescriptionMaxLengthExceeded(
    props: Pick<CreateProps, 'title' | 'description' | 'isCarousel'>,
  ): boolean {
    const { title, description, isCarousel } = props;
    if (!title) return false;

    const titleLength = title.length,
      descriptionLength = description?.length ?? 0;

    if (isCarousel) {
      return (
        titleLength + descriptionLength >
        this.TITLE_DESCRIPTION_MAX_LENGTH_IN_CAROUSEL_TYPE
      );
    } else {
      return (
        titleLength + descriptionLength >
        this.TITLE_DESCRIPTION_MAX_LENGTH_IN_SINGLE_TYPE
      );
    }
  }

  private static isButtonLayoutVerticalWhenCarousel(
    props: Pick<CreateProps, 'buttonLayout' | 'isCarousel'>,
  ) {
    if (!props.buttonLayout) return false;

    if (props.isCarousel) {
      return props.buttonLayout === 'vertical';
    }

    return false;
  }

  private static isButtonsMaxNumberExceededWhenLayoutVertical(
    props: Pick<CreateProps, 'buttonLayout' | 'buttons'>,
  ): boolean {
    if (!props.buttons) return false;

    if (props.buttonLayout === 'vertical') {
      return props.buttons.length > this.BUTTON_MAX_NUMBER_WHEN_LAYOUT_VERTICAL;
    }

    return false;
  }

  private static isButtonsMaxNumberExceededWhenLayoutHorizontal(
    props: Pick<CreateProps, 'buttonLayout' | 'buttons'>,
  ): boolean {
    if (!props.buttons) return false;

    if (props.buttonLayout === 'horizontal') {
      return (
        props.buttons.length > this.BUTTON_MAX_NUMBER_WHEN_LAYOUT_HOTIZONTAL
      );
    }

    return false;
  }

  private constructor(props: ItemCardProps) {
    super(props);
  }
}
