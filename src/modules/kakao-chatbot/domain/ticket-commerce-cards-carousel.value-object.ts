import { combine, DomainError, err, ok, Result, ValueObject } from 'src/core';
import { Ticket, TicketCategoryEnum } from 'src/modules/ticket';
import { Button, ButtonActionEnum } from './button.value-object';
import {
  Carousel,
  CarouselTypeEnum,
  CommerceCardCarouselProps,
} from './carousel';
import { CommerceCard } from './commerce-card';
import {
  ButtonError,
  CommerceCardError,
  ThumbnailError,
  TicketCommerceCardsCarouselError,
} from './errors';
import { Profile } from './profile.value-object';
import { Thumbnail } from './thumbnail.value-object';

export interface TicketCommerceCardsCarouselProps {
  tickets: Ticket[];
}

export class TicketCommerceCardsCarousel extends ValueObject<CommerceCardCarouselProps> {
  public static create(
    props: TicketCommerceCardsCarouselProps,
  ): Result<Carousel, TicketCommerceCardsCarouselError> {
    const ticketCommerceCardResultCollection = props.tickets.map((ticket) =>
      this.createTicketCommerceCard(ticket),
    );
    const ticketCommerceCardsResult = combine(
      ...ticketCommerceCardResultCollection,
    );
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
    const buyButtonResult = Button.create({
      label: '구매하기',
      action: ButtonActionEnum.MESSAGE,
      messageText: `${ticket.title} 구매하기`,
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
      buyButtonResult,
    );
    if (ticketPropsResult.isErr()) {
      return err(ticketPropsResult.error);
    }

    const [thumbnail, profile, buyButton] = ticketPropsResult.value;

    const commerceCardResult = CommerceCard.create({
      description: ticket.title,
      price: ticket.price,
      thumbnails: [thumbnail],
      profile,
      buttons: [buyButton],
    });
    if (commerceCardResult.isErr()) {
      return err(commerceCardResult.error);
    }

    return ok(commerceCardResult.value);
  }

  private static createTicketThumbnail(
    category: TicketCategoryEnum,
  ): Result<Thumbnail, ThumbnailError> {
    // TODO: config module에서 validation
    const host = process.env.HOST;
    if (!host) {
      throw new DomainError('HOST config not defined');
    }

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

  private constructor(props: CommerceCardCarouselProps) {
    super(props);
  }
}
