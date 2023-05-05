import { combine, DomainError, err, ok, Result, ValueObject } from 'src/core';
import { TicketCategoryEnum } from 'src/modules/ticketing/domain/ticket/ticket-category.value-object';
import { Ticket } from 'src/modules/ticketing/domain/ticket/ticket.aggregate-root';
import { Button, ButtonActionEnum } from '../base/button/button.value-object';
import { ButtonError } from '../base/button/button.error';
import { TicketCommerceCardsCarouselError } from './ticket-commerce-cards-carousel.error';
import {
  Carousel,
  CarouselTypeEnum,
} from '../base/carousel/carousel.value-object';
import { CommerceCard } from '../base/commerce-card/commerce-card.value-object';
import { CommerceCardError } from '../base/commerce-card/commerce-card.error';
import { Profile } from '../base/profile/profile.value-object';
import { ThumbnailError } from '../base/thumbnail/thumbnail.error';
import { Thumbnail } from '../base/thumbnail/thumbnail.value-object';

export interface TicketCommerceCardsCarouselProps {
  tickets: Ticket[];
}

export class TicketCommerceCardsCarousel extends ValueObject {
  public static create(
    props: TicketCommerceCardsCarouselProps,
  ): Result<Carousel, TicketCommerceCardsCarouselError> {
    const ticketCommerceCardOrErrors = props.tickets.map((ticket) =>
      this.createTicketCommerceCard(ticket),
    );
    const ticketCommerceCardsOrError = combine(...ticketCommerceCardOrErrors);
    if (ticketCommerceCardsOrError.isErr()) {
      return err(ticketCommerceCardsOrError.error);
    }

    return Carousel.create({
      type: CarouselTypeEnum.COMMERCE_CARD,
      items: ticketCommerceCardsOrError.value,
    });
  }

  private static createTicketCommerceCard(
    ticket: Ticket,
  ): Result<CommerceCard, CommerceCardError | ButtonError> {
    const selectButtonOrError = Button.create({
      label: `${ticket.title} 선택하기`,
      action: ButtonActionEnum.BLOCK,
      // TODO: config module에서 validation
      blockId: process.env.GET_ROOMS_STATUS_FOR_TICKETING_BLOCK_ID,
      messageText: `${ticket.title} 선택`,
      extra: {
        ticketing: {
          ticket_id: ticket.id.value,
        },
      },
    });
    const thumbnailOrError = this.createTicketThumbnail(ticket.category.value);

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
      price: ticket.price,
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
    category: TicketCategoryEnum,
  ): Result<Thumbnail, ThumbnailError> {
    // TODO: config 모듈에서 validation
    const host = process.env.HOST;
    if (!host) {
      throw new DomainError('HOST config not defined');
    }

    // TODO: 파일 경로들도 config 모듈에서 설정
    const path = host + '/files/images';
    let imageUrl: string;

    switch (category) {
      case TicketCategoryEnum.PERIOD:
        imageUrl = path + '/period_ticket.png';
        break;
      case TicketCategoryEnum.HOURS_RECHARGE:
        imageUrl = path + '/hours_recharge_ticket.png';
        break;
      case TicketCategoryEnum.SAME_DAY:
        imageUrl = path + '/sameday_ticket.png';
        break;
    }

    return Thumbnail.create({
      imageUrl,
    });
  }
}
