import { DomainError, Result, combine, err, ok } from 'src/core';
import { Carousel, CarouselProps } from '../carousel.new/carousel.value-object';
import { ListCard, ListCardProps } from '../list-card/list-card.value-object';

type Props = CarouselProps<ListCardType, ListCard>;
export const LIST_CARD_TYPE = 'listCard';
export type ListCardType = typeof LIST_CARD_TYPE;
type CreateProps = {
  listCards: ListCardProps[];
};

export class ListCardCarousel extends Carousel<ListCardType, ListCard> {
  public static create(
    props: CreateProps,
  ): Result<ListCardCarousel, DomainError> {
    const listCardsOrError = combine(
      ...props.listCards.map((listCard) => ListCard.create(listCard)),
    );
    if (listCardsOrError.isErr()) return err(listCardsOrError.error);

    return ok(
      new ListCardCarousel({
        type: LIST_CARD_TYPE,
        items: listCardsOrError.value,
      }),
    );
  }

  protected constructor(props: Props) {
    super(props);
  }
}
