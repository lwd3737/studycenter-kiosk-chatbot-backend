import { Carousel, CarouselProps } from '../carousel/carousel.value-object';
import { CommerceCard } from '../commerce-card/commerce-card.value-object';

export const COMMERCE_CARD_TYPE = 'commerceCard';
export type CommerceCardType = typeof COMMERCE_CARD_TYPE;
type CreateProps = Omit<CarouselProps<CommerceCardType, CommerceCard>, 'type'>;

export class CommerceCardCarousel extends Carousel<
  CommerceCardType,
  CommerceCard
> {
  public static create(props: CreateProps) {
    return new CommerceCardCarousel({
      type: COMMERCE_CARD_TYPE,
      ...props,
    });
  }
}
