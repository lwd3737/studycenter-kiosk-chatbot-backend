import { combine, err, ok, Result, ValueObject } from 'src/core';
import { Button, ButtonActionEnum } from '../base/button/button.value-object';
import { TicketListCarouselError } from './ticket-collection-list-card-carousel.error';
import {
  Carousel,
  CarouselTypeEnum,
} from '../base/carousel/carousel.value-object';
import { ListCardError } from '../base/list-card/list-card.error';
import { ListCard } from '../base/list-card/list-card.value-object';
import { ListCardHeader } from '../base/list-card/header.value-object';
import { ListItem } from '../base/list-card/item.value-object';
import { Ticket } from 'src/modules/ticketing';

export interface TicketCollectionListCarouselProps {
  ticketCollections: Ticket[][];
}

export class TicketListCarousel extends ValueObject {
  public static create(
    props: TicketCollectionListCarouselProps,
  ): Result<Carousel, TicketListCarouselError> {
    const ticketListCardCollectionsOrError = props.ticketCollections.map(
      this.createTicketListCard,
    );
    const ticketListCardsOrError = combine(...ticketListCardCollectionsOrError);
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
    const { type, title } = ticketCollection[0];

    const headerOrError = ListCardHeader.create({ title: type.label });
    const itemOrErrors = ticketCollection.map((ticket) =>
      ListItem.create({
        title: ticket.title,
        description: `${ticket.price.value}원`,
      }),
    );
    const buttonOrError = Button.create({
      label: `${type.label} 선택`,
      action: ButtonActionEnum.MESSAGE,
      messageText: `${type.label} 선택`,
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
