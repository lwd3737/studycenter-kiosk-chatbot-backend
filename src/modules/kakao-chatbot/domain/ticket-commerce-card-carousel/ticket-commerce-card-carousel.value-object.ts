import { combine, DomainError, err, ok, Result } from 'src/core';
import {
  Button,
  ButtonActionType,
} from '../basic-template-outputs/button/button.value-object';
import { ButtonError } from '../basic-template-outputs/button/button.error';
import { TicketCommerceCardCarouselError } from './ticket-commerce-card-carousel.error';
import { CommerceCard } from '../basic-template-outputs/commerce-card/commerce-card.value-object';
import { CommerceCardError } from '../basic-template-outputs/commerce-card/commerce-card.error';
import { Profile } from '../basic-template-outputs/profile/profile.value-object';
import { ThumbnailError } from '../basic-template-outputs/thumbnail/thumbnail.error';
import { Thumbnail } from '../basic-template-outputs/thumbnail/thumbnail.value-object';
import { Ticket, TicketType } from 'src/modules/ticketing';
import { CommerceCardCarousel } from '../basic-template-outputs/commerce-card-carousel/commerce-card-carousel.value-object';

interface TicketCommerceCardCarouselProps {
  tickets: Ticket[];
}

export class TicketCommerceCardCarousel extends CommerceCardCarousel {
  public static createFrom(
    props: TicketCommerceCardCarouselProps,
  ): Result<CommerceCardCarousel, TicketCommerceCardCarouselError> {
    const ticketCommerceCardsOrError = combine(
      ...props.tickets.map((ticket) => this.createTicketCommerceCard(ticket)),
    );
    if (ticketCommerceCardsOrError.isErr()) {
      return err(ticketCommerceCardsOrError.error);
    }

    return ok(
      this.create({
        items: ticketCommerceCardsOrError.value,
      }),
    );
  }

  private static createTicketCommerceCard(
    ticket: Ticket,
  ): Result<CommerceCard, CommerceCardError | ButtonError> {
    const selectButtonOrError = Button.create({
      label: `${ticket.title} 선택하기`,
      action: ButtonActionType.BLOCK,
      // TODO: config module에서 validation
      blockId: process.env.GET_ROOMS_STATUS_FOR_TICKETING_BLOCK_ID,
      messageText: `${ticket.title} 선택`,
      extra: {
        ticketing: {
          ticket_id: ticket.id.value,
        },
      },
    });
    const thumbnailOrError = this.createTicketThumbnail(ticket.type);

    // TODO: config module에서 validation
    const locationName = process.env.LOCATION_NAME;
    if (!locationName) {
      throw new DomainError('Location name config not defined');
    }
    const profileOrError = Profile.create({ nickname: locationName });

    const ticketPropsOrError = combine(
      thumbnailOrError,
      profileOrError,
      selectButtonOrError,
    );
    if (ticketPropsOrError.isErr()) {
      return err(ticketPropsOrError.error);
    }

    const [thumbnail, profile, selectButton] = ticketPropsOrError.value;

    const commerceCardOrError = CommerceCard.create({
      description: ticket.title,
      price: ticket.price.value,
      thumbnails: [thumbnail],
      profile,
      buttons: [selectButton],
    });
    if (commerceCardOrError.isErr()) {
      return err(commerceCardOrError.error);
    }

    return ok(commerceCardOrError.value);
  }

  private static createTicketThumbnail(
    type: TicketType,
  ): Result<Thumbnail, ThumbnailError> {
    // TODO: config 모듈에서 validation
    const host = process.env.HOST;
    if (!host) {
      throw new DomainError('HOST config not defined');
    }

    // TODO: 파일 경로들도 config 모듈에서 설정
    const path = host + '/files/images';
    const imageUrl: string = path + type.value + '_ticket.png';

    return Thumbnail.create({
      imageUrl,
    });
  }
}
