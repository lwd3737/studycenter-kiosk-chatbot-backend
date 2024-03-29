import { DomainError, Result, combine, err } from 'src/core';
import {
  Button,
  ButtonActionType,
} from '../basic-template-outputs/button/button.value-object';
import { ListCard } from '../basic-template-outputs/list-card/list-card.value-object';
import { Ticket } from 'src/modules/ticketing';
import { ListCardCarousel } from '../basic-template-outputs/list-card-carousel/list-card-carousel.value-object';
import { ListCardHeader } from '../basic-template-outputs/list-card/header.value-object';
import { ListCardItem } from '../basic-template-outputs/list-card/item.value-object';

interface TicketGroupListCarouselProps {
  ticketGroups: Ticket[][];
}

export class TicketGroupListCardCarousel extends ListCardCarousel {
  public static from(
    props: TicketGroupListCarouselProps,
  ): Result<TicketGroupListCardCarousel, DomainError> {
    const listCardsOrError = combine(
      ...props.ticketGroups.map(this.createListCard),
    );

    if (listCardsOrError.isErr()) return err(listCardsOrError.error);

    return this.create(listCardsOrError.value);
  }

  private static createListCard(tickets: Ticket[]) {
    const { typeDisplay: displayType } = tickets[0];

    const listCardPropsOrError = combine(
      ListCardHeader.create({
        title: displayType,
      }),
      Button.create({
        label: `${displayType} 선택`,
        action: ButtonActionType.MESSAGE,
        messageText: `${displayType} 선택`,
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
