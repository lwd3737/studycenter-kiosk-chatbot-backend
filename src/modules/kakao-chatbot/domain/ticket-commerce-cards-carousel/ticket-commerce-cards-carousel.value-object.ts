import { combine, DomainError, err, ok, Result, ValueObject } from 'src/core';
import { TicketCategoryEnum } from 'src/modules/ticketing/domain/ticket/ticket-category.value-object';
import { Ticket } from 'src/modules/ticketing/domain/ticket/ticket.aggregate-root';
import { Button, ButtonActionEnum } from '../button/button.value-object';
import { Carousel, CarouselTypeEnum } from '../carousel/carousel.value-object';
import { CommerceCard } from '../commerce-card/commerce-card.value-object';
import { ButtonError } from '../button/button.error';
import { CommerceCardError } from '../commerce-card/commerce-card.error';
import { ThumbnailError } from '../thumbnail/thumbnail.error';
import { TicketCommerceCardsCarouselError } from './ticket-commerce-cards-carousel.error';

import { Profile } from '../profile/profile.value-object';
import { Thumbnail } from '../thumbnail/thumbnail.value-object';

export interface TicketCommerceCardsCarouselProps {
  tickets: Ticket[];
}

export class TicketCommerceCardsCarousel extends ValueObject {
  public static create(
    props: TicketCommerceCardsCarouselProps,
  ): Result<Carousel, TicketCommerceCardsCarouselError> {
    const ticketCommerceCardResults = props.tickets.map((ticket) =>
      this.createTicketCommerceCard(ticket),
    );
    const ticketCommerceCardsResult = combine(...ticketCommerceCardResults);
    if (ticketCommerceCardsResult.isErr()) {
      return err(ticketCommerceCardsResult.error);
    }

    return Carousel.create({
      type: CarouselTypeEnum.COMMERCE_CARD,
      items: ticketCommerceCardsResult.value,
    });
  }

  private static createTicketCommerceCard(
    ticket: Ticket,
  ): Result<CommerceCard, CommerceCardError | ButtonError> {
    const purchaseButtonResult = Button.create({
      label: `${ticket.title} 선택하기`,
      action: ButtonActionEnum.MESSAGE,
      messageText: `${ticket.title} 선택.\n 룸을 보여줘`,
      extra: {
        ticketId: ticket.id.value,
      },
    });
    const thumbnailResult = this.createTicketThumbnail(ticket.category.value);

    // TODO: config module에서 validation
    const locationName = process.env.LOCATION_NAME;
    if (!locationName) {
      throw new DomainError('Location name config not defined');
    }
    const profileResult = Profile.create({ nickname: locationName });

    const ticketPropsResult = combine(
      thumbnailResult,
      profileResult,
      purchaseButtonResult,
    );
    if (ticketPropsResult.isErr()) {
      return err(ticketPropsResult.error);
    }

    const [thumbnail, profile, purchaseButton] = ticketPropsResult.value;

    const commerceCardResult = CommerceCard.create({
      description: ticket.title,
      price: ticket.price,
      thumbnails: [thumbnail],
      profile,
      buttons: [purchaseButton],
    });
    if (commerceCardResult.isErr()) {
      return err(commerceCardResult.error);
    }

    return ok(commerceCardResult.value);
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
