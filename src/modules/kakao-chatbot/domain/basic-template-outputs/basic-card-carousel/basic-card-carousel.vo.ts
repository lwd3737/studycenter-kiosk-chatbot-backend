import { DomainError, Result, combine, err, ok } from 'src/core';
import { BasicCard, CreateBasicCardProps } from '../basic-card/basic-card.vo';
import { Carousel, CarouselProps } from '../carousel/carousel.value-object';

export type BasicCardType = typeof BASIC_CARD_TYPE;
export type CreateBasicCardCarouselProps = Omit<
  CarouselProps<BasicCardType, CreateBasicCardProps>,
  'type'
>;
export const BASIC_CARD_TYPE = 'basicCard';

export class BasicCardCarousel extends Carousel<BasicCardType, BasicCard> {
  public static create(
    props: CreateBasicCardCarouselProps,
  ): Result<BasicCardCarousel, DomainError> {
    const itemsOrError = combine(
      ...props.items.map((item) => BasicCard.create(item)),
    );
    if (itemsOrError.isErr()) return err(itemsOrError.error);

    return ok(
      new BasicCardCarousel({
        type: BASIC_CARD_TYPE,
        ...props,
        items: itemsOrError.value,
      }),
    );
  }
}
