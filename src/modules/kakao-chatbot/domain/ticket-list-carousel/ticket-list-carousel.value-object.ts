import { combine, err, ok, Result, ValueObject } from 'src/core';
import { Ticket } from 'src/modules/ticketing/domain/ticket/ticket.aggregate-root';
import { Button, ButtonActionEnum } from '../base/button/button.value-object';
import { TicketListCarouselError } from './ticket-list-carousel.error';
import {
  Carousel,
  CarouselTypeEnum,
} from '../base/carousel/carousel.value-object';
import { ListCardError } from '../base/list-card/list-card.error';
import { ListCard } from '../base/list-card/list-card.value-object';
import { ListCardHeader } from '../base/list-card/list-card-header.value-object';
import { ListItem } from '../base/list-card/list-item.value-object';

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
    const ticketListCardsOrError = combine(...ticketListCardResultCollection);
    if (ticketListCardsOrError.isErr()) {
      return err(ticketListCardsOrError.error);
    }

    const carouselOrError = Carousel.create({
      type: CarouselTypeEnum.LIST_CARD,
      items: ticketListCardsOrError.value,
    });
    if (carouselOrError.isErr()) {
      return err(carouselOrError.error);
    }

    return ok(carouselOrError.value);
  }

  private static createTicketListCard(
    ticketCollection: Ticket[],
  ): Result<ListCard, ListCardError> {
    const { category } = ticketCollection[0];

    const headerOrError = ListCardHeader.create({ title: category.label });
    const itemOrErrors = ticketCollection.map((ticket) =>
      ListItem.create({
        title: ticket.title,
        description: `${ticket.price}원`,
      }),
    );
    const buttonOrError = Button.create({
      label: `${category.label} 선택`,
      action: ButtonActionEnum.MESSAGE,
      messageText: `${category.label} 선택`,
    });

    const listCardProps = combine(
      headerOrError,
      buttonOrError,
      ...itemOrErrors,
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
