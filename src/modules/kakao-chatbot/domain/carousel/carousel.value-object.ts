import { ok, Result, ValueObject } from 'src/core';
import { ListCard } from '../list-card';
import { CarouselHeader } from './carousel-header.value-object';

export type CarouselProps = { header?: CarouselHeader } & {
  type: CarouselTypeEnum.LIST_CARD;
  items: CarouselItem[];
};

export type CarouselItem = ListCard;

export enum CarouselTypeEnum {
  BASIC_CARD = 'basicCard',
  COMMERCE_CARD = 'commerceCard',
  LIST_CARD = 'listCard',
  ITEM_CARD = 'itemCard',
}

export class Carousel extends ValueObject<CarouselProps> {
  get type(): CarouselTypeEnum {
    return this.props.type;
  }

  get items(): CarouselItem[] {
    return this.props.items;
  }

  protected constructor(props: CarouselProps) {
    super(props);
  }

  public static create(props: CarouselProps): Result<Carousel> {
    return ok(new Carousel(props));
  }
}
