import { combine, err, ok, Result, ValueObject } from 'src/core';
import { Ticket } from 'src/modules/ticket';
import { Button, ButtonActionEnum } from './button.value-object';
import { Carousel, CarouselTypeEnum, ListCardCarouselProps } from './carousel';
import { ListItemError, TicketListCarouselError } from './errors';
import { ListCard, ListHeader, ListItem } from './list-card';

export interface TicketListCarouselProps {
  ticketCollections: Ticket[][];
}

export class TicketListCarousel extends ValueObject<ListCardCarouselProps> {
  private constructor(props: ListCardCarouselProps) {
    super(props);
  }

  public static create(
    props: TicketListCarouselProps,
  ): Result<Carousel, TicketListCarouselError> {
    const ticketListCardResultCollection = props.ticketCollections.map(
      this.createTicketListCard,
    );
    const ticketListCardsResult = combine(...ticketListCardResultCollection);
    if (ticketListCardsResult.isErr()) {
      return err(ticketListCardsResult.error);
    }

    const carouselResult = Carousel.create({
      type: CarouselTypeEnum.LIST_CARD,
      items: ticketListCardsResult.value,
    });
    if (carouselResult.isErr()) {
      return err(carouselResult.error);
    }

    return ok(carouselResult.value);
  }

  private static createTicketListCard(
    ticketCollection: Ticket[],
  ): Result<ListCard, ListItemError> {
    const { category } = ticketCollection[0];

    const headerResult = ListHeader.create({ title: category.label });
    const itemResultCollection = ticketCollection.map((ticket) =>
      ListItem.create({
        title: ticket.title,
        description: `${ticket.price}원`,
      }),
    );
    const buttonResult = Button.create({
      label: '더보기',
      action: ButtonActionEnum.MESSAGE,
      messageText: `${category.label}`,
    });

    const listCardProps = combine(
      headerResult,
      buttonResult,
      ...itemResultCollection,
    );
    if (listCardProps.isErr()) {
      return err(listCardProps.error);
    }

    const [header, button, ...items] = listCardProps.value;

    return ListCard.create({
      header,
      items,
      buttons: [button],
    });
  }
}
