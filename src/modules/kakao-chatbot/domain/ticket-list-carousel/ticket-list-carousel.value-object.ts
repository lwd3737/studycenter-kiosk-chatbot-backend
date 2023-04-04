import { combine, err, ok, Result, ValueObject } from 'src/core';
import { Ticket } from 'src/modules/ticketing/domain/ticket/ticket.aggregate-root';
import { Button, ButtonActionEnum } from '../button/button.value-object';
import { Carousel, CarouselTypeEnum } from '../carousel/carousel.value-object';
import { ListCardError } from '../list-card/list-card.error';
import { TicketListCarouselError } from './ticket-list-carousel.error';
import { ListCard } from '../list-card/list-card.value-object';
import { ListHeader } from '../list-card/list-header.value-object';
import { ListItem } from '../list-card/list-item.value-object';

export interface TicketListCarouselProps {
  ticketCollections: Ticket[][];
}

export class TicketListCarousel extends ValueObject {
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
  ): Result<ListCard, ListCardError> {
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
