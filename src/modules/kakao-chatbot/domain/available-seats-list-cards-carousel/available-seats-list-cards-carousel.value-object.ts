import { DomainError, Result, ValueObject, combine, err, ok } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import {
  Carousel,
  CarouselTypeEnum,
} from '../base/carousel/carousel.value-object';
import { AvailableSeatsListCardsCarouselErrors } from './available-seats-list-cards-carousel.error';
import { ListCard } from '../base/list-card/list-card.value-object';
import { ListCardHeader } from '../base/list-card/list-card-header.value-object';
import { ListItem } from '../base/list-card/list-item.value-object';

type CreateProps = {
  ticketId: string;
  room: Room;
  seats: Seat[];
};

export class AvailableSeatsListCardsCarousel extends ValueObject<CreateProps> {
  public static SEATS_MAX_COUNT = 25;
  private static LIST_CARD_ITEMS_MAX_COUNT = 5;

  public static create(props: CreateProps): Result<Carousel, DomainError> {
    const validOrError = this.validate(props);
    if (validOrError.isErr()) return err(validOrError.error);

    const listCardsOrError = this.createListCards(props);
    if (listCardsOrError.isErr()) return err(listCardsOrError.error);

    return Carousel.create({
      type: CarouselTypeEnum.LIST_CARD,
      items: listCardsOrError.value,
    });
  }

  private static validate(props: CreateProps): Result<true, DomainError> {
    if (this.isSeatsMaxCountExceeded(props))
      return err(
        new AvailableSeatsListCardsCarouselErrors.SeatsMaxCountExceededError(),
      );
    if (this.isUnavailableSeatExists(props))
      return err(
        new AvailableSeatsListCardsCarouselErrors.UnavailableSeatExistsError(),
      );

    return ok(true);
  }

  private static isUnavailableSeatExists(props: CreateProps) {
    return props.seats.filter((seat) => seat.isAvailable === false).length > 0;
  }

  private static isSeatsMaxCountExceeded(props: CreateProps) {
    return props.seats.length > this.SEATS_MAX_COUNT;
  }

  private static createListCards(
    props: CreateProps,
  ): Result<ListCard[], DomainError> {
    const listCardCount = this.countListCard(props.seats);
    const listCardsOrError = combine(
      ...Array(listCardCount)
        .fill(true)
        .map((_, index) =>
          this.createListCard(props.seats, index, {
            ...props,
          }),
        ),
    );
    if (listCardsOrError.isErr()) return err(listCardsOrError.error);

    return ok(listCardsOrError.value);
  }

  private static createListCard(
    seats: Seat[],
    index: number,
    info: {
      ticketId: string;
      room: Room;
    },
  ) {
    const listCardCount = this.countListCard(seats);
    const startIndex = index * this.LIST_CARD_ITEMS_MAX_COUNT;
    const isLastIndex = index === listCardCount - 1;
    const endIndex = isLastIndex
      ? listCardCount === 1
        ? seats.length
        : index * this.LIST_CARD_ITEMS_MAX_COUNT +
          (seats.length % this.LIST_CARD_ITEMS_MAX_COUNT)
      : (index + 1) * this.LIST_CARD_ITEMS_MAX_COUNT;

    const curSeats = seats.slice(startIndex, endIndex);

    const listCardPropsOrError = combine(
      ListCardHeader.create({
        title: `${info.room.title} 이용가능한 좌석`,
      }),
      ...curSeats.map((seat) =>
        ListItem.create({
          title: `${seat.number.value}번 좌석`,
          description: '이용가능',
          blockId: process.env.SELECT_SEAT_BLOCK_ID,
          messageText: `${seat.number.value}번 좌석 선택`,
          extra: {
            ticket_id: info.ticketId,
            room_id: info.room.id,
            seat_id: seat.id,
          },
        }),
      ),
    );
    if (listCardPropsOrError.isErr()) return err(listCardPropsOrError.error);
    const [header, ...items] = listCardPropsOrError.value;

    const listCardOrError = ListCard.create({
      header,
      items,
    });
    if (listCardOrError.isErr()) return err(listCardOrError.error);

    return ok(listCardOrError.value);
  }

  private static countListCard(seats: Seat[]) {
    return Math.ceil(seats.length / this.LIST_CARD_ITEMS_MAX_COUNT);
  }
}
