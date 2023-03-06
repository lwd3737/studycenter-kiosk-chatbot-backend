import { combine, err, ok, Result } from 'src/core';
import { Ticket } from 'src/domains/ticket';
import { Button, ButtonActionEnum } from './button.value-object';
import { Carousel, CarouselProps, CarouselTypeEnum } from './carousel';
import { ListItemError, TicketListCarouselError } from './errors';
import { ListCard, ListHeader, ListItem } from './list-card';

export interface TicketListCarouselProps {
  ticketCollections: Ticket[][];
}

export class TicketListCarousel extends Carousel {
  private constructor(props: CarouselProps) {
    super(props);
  }

  public static build(
    props: TicketListCarouselProps,
  ): Result<TicketListCarousel, TicketListCarouselError> {
    const ticketListCardResults = props.ticketCollections.map(
      this.createTicketListCard,
    );
    const ticketListCardsResult = combine(...ticketListCardResults);
    if (ticketListCardsResult.isErr()) {
      return err(ticketListCardsResult.error);
    }

    return ok(
      new TicketListCarousel({
        type: CarouselTypeEnum.LIST_CARD,
        items: ticketListCardsResult.value,
      }),
    );
  }

  private static createTicketListCard(
    ticketCollection: Ticket[],
  ): Result<ListCard, ListItemError> {
    const { category } = ticketCollection[0];

    const headerResult = ListHeader.create({ title: category.label });
    const itemResults = ticketCollection.map((ticket) =>
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

    const listCardProps = combine(headerResult, buttonResult, ...itemResults);
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
