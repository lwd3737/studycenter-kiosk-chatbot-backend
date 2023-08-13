import { Carousel, CarouselProps } from '../carousel/carousel.value-object';
import { ItemCard } from '../item-card/item-card.value-object';

export const ITEM_CARD_TYPE = 'itemCard';
export type ItemCardType = typeof ITEM_CARD_TYPE;
type CreateProps = Omit<CarouselProps<ItemCardType, ItemCard>, 'type'>;

export class ItemCardCarousel extends Carousel<ItemCardType, ItemCard> {
  public static create(props: CreateProps): ItemCardCarousel {
    return new ItemCardCarousel({
      type: ITEM_CARD_TYPE,
      ...props,
    });
  }
}
