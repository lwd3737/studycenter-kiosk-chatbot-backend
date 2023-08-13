import { DomainError, Result, combine, err, ok } from 'src/core';
import { Carousel } from '../carousel/carousel.value-object';
import { ListCard, ListCardProps } from '../list-card/list-card.value-object';

export const LIST_CARD_TYPE = 'listCard';
export type ListCardType = typeof LIST_CARD_TYPE;

export class ListCardCarousel extends Carousel<ListCardType, ListCard> {
  public static create(
    props: ListCardProps[],
  ): Result<ListCardCarousel, DomainError> {
    const listCardsOrError = combine(
      ...props.map((listCardProps) => ListCard.create(listCardProps)),
    );
    if (listCardsOrError.isErr()) return err(listCardsOrError.error);

    return ok(
      new ListCardCarousel({
        type: LIST_CARD_TYPE,
        items: listCardsOrError.value,
      }),
    );
  }
}
