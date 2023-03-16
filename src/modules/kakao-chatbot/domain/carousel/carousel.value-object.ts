import { err, ok, Result, ValueObject } from 'src/core';
import { CommerceCard } from '../commerce-card/commerce-card.value-object';
import { CarouselError, CarouselErrors } from '../errors/carousel.error';
import { ListCard } from '../list-card/list-card.value-object';
import { CarouselHeader } from './carousel-header.value-object';

// TODO: OCP 원칙 위배. 추상 Facory 패턴으로 수정 및 추가에도 수정에 열려있게 구현할 것

export type CarouselProps = ListCardCarouselProps | CommerceCardCarouselProps;

export type ListCardCarouselProps = {
  header?: CarouselHeader;
  type: CarouselTypeEnum.LIST_CARD;
  items: ListCard[];
};

export type CommerceCardCarouselProps = {
  header?: CarouselHeader;
  type: CarouselTypeEnum.COMMERCE_CARD;
  items: CommerceCard[];
};

export enum CarouselTypeEnum {
  COMMERCE_CARD = 'commerceCard',
  BASIC_CARD = 'basicCard',
  LIST_CARD = 'listCard',
  ITEM_CARD = 'itemCard',
}

export type CarouselItem = ListCard | CommerceCard;
// TODO:상속할 때 validate 강제하기
export class Carousel extends ValueObject<CarouselProps> {
  get type(): CarouselTypeEnum {
    return this.props.type;
  }

  get items(): CarouselItem[] {
    return this.props.items as CarouselItem[];
  }

  public static create(props: CarouselProps): Result<Carousel, CarouselError> {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new Carousel(props));
  }

  private static validate(props: CarouselProps): Result<null, CarouselError> {
    const { type, items } = props;

    if (this.isTypeAndItemMismatched(type, items)) {
      return err(new CarouselErrors.TypeAndItemsMismatchedError(type, items));
    }

    return ok(null);
  }

  private static isTypeAndItemMismatched(
    type: CarouselTypeEnum,
    items: CarouselItem[],
  ): boolean {
    const item = items[0];

    switch (type) {
      case CarouselTypeEnum.BASIC_CARD:
      case CarouselTypeEnum.ITEM_CARD:
        throw new Error(`Carousel type '${type}' not impleted yet`);
      case CarouselTypeEnum.COMMERCE_CARD:
        return item instanceof CommerceCard === false;
      case CarouselTypeEnum.LIST_CARD:
        return item instanceof ListCard === false;
    }
  }

  private constructor(props: CarouselProps) {
    super(props);
  }
}
