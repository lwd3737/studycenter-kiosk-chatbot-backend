import { DomainError, Result } from 'src/core';
import { ButtonActionEnum } from '../base/button/button.value-object';
import { ListCardProps } from '../base/list-card/list-card.value-object';
import { Ticket } from 'src/modules/ticketing';
import { ListCardCarousel } from '../base/list-card-carousel/list-card-carousel.value-object';

interface TicketCollectionListCarouselProps {
  ticketCollections: Ticket[][];
}

export class TicketCollectionListCardCarousel extends ListCardCarousel {
  public static createFrom(
    props: TicketCollectionListCarouselProps,
  ): Result<TicketCollectionListCardCarousel, DomainError> {
    const listCards = props.ticketCollections.map((collection) => {
      const { type } = collection[0];

      return {
        header: { title: type.label },
        items: collection.map((ticket) => ({
          title: ticket.title,
          description: `${ticket.price.value}원`,
        })),
        buttons: [
          {
            label: `${type.label} 선택`,
            action: ButtonActionEnum.MESSAGE,
            messageText: `${type.label} 선택`,
          },
        ],
      } as ListCardProps;
    });

    return this.create({
      listCards,
    });
  }
}
