import { DomainError, Result, combine, err } from 'src/core';
import { Button, ButtonActionEnum } from '../base/button/button.value-object';
import { ListCard } from '../base/list-card/list-card.value-object';
import { Ticket } from 'src/modules/ticketing';
import { ListCardCarousel } from '../base/list-card-carousel/list-card-carousel.value-object';
import { ListCardHeader } from '../base/list-card/header.value-object';
import { ListCardItem } from '../base/list-card/item.value-object';

interface TicketCollectionListCarouselProps {
  ticketCollections: Ticket[][];
}

export class TicketCollectionListCardCarousel extends ListCardCarousel {
  public static createFrom(
    props: TicketCollectionListCarouselProps,
  ): Result<TicketCollectionListCardCarousel, DomainError> {
    const listCardsOrError = combine(
      ...props.ticketCollections.map(this.createListCard),
    );

    if (listCardsOrError.isErr()) return err(listCardsOrError.error);

    return this.create(listCardsOrError.value);
  }

  private static createListCard(tickets: Ticket[]) {
    const { type } = tickets[0];

    const listCardPropsOrError = combine(
      ListCardHeader.create({
        title: type.label,
      }),
      Button.create({
        label: `${type.label} 선택`,
        action: ButtonActionEnum.MESSAGE,
        messageText: `${type.label} 선택`,
      }),
      ...tickets.map((ticket) =>
        ListCardItem.create({
          title: ticket.title,
          description: `${ticket.price.value}원`,
        }),
      ),
    );
    if (listCardPropsOrError.isErr()) return err(listCardPropsOrError.error);

    const [header, button, ...items] = listCardPropsOrError.value;
    return ListCard.create({ header, items, buttons: [button] });
  }
}
