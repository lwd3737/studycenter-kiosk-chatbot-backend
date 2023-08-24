import { DomainError, Result, combine, err, ok } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import { AvailableSeatsListCardsCarouselErrors } from './available-seats-list-cards-carousel.error';
import { ListCard } from '../basic-template-outputs/list-card/list-card.value-object';
import { ListCardHeader } from '../basic-template-outputs/list-card/header.value-object';
import {
  ListCardItem,
  ListCardItemActionEnum,
} from '../basic-template-outputs/list-card/item.value-object';
import { ListCardCarousel } from '../basic-template-outputs/list-card-carousel/list-card-carousel.value-object';

type CreateProps = {
  ticketId: string;
  room: Room;
  seats: Seat[];
};
type CarouselIndex = number;

export class AvailableSeatsListCardCarousel extends ListCardCarousel {
  public static SEATS_MAX_COUNT = 25;
  private static LIST_CARD_ITEMS_MAX_COUNT = 5;

  public static createFrom(
    props: CreateProps,
  ): Result<AvailableSeatsListCardCarousel, DomainError> {
    const validOrError = this.validate(props);
    if (validOrError.isErr()) return err(validOrError.error);

    const listCardsOrError = this.createListCards(props);
    if (listCardsOrError.isErr()) return err(listCardsOrError.error);

    return this.create(listCardsOrError.value);
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
    index: CarouselIndex,
    context: {
      ticketId: string;
      room: Room;
    },
  ) {
    const [startIndex, endIndex] = this.calculateCurrentListCardRange(
      seats,
      index,
    );
    const currentSeats = seats.slice(startIndex, endIndex);

    const listCardPropsOrError = combine(
      ListCardHeader.create({
        title: `${context.room.title} 이용가능한 좌석`,
      }),
      ...currentSeats.map((seat) =>
        ListCardItem.create({
          title: `${seat.number.value}번 좌석`,
          description: '이용가능',
          action: ListCardItemActionEnum.BLOCK,
          blockId: process.env.CONFIRM_TICKET_BLOCK_ID,
          messageText: `${seat.number.value}번 좌석 선택`,
          extra: {
            ticketing: {
              ticket_id: context.ticketId,
              room_id: context.room.id.value,
              seat_id: seat.id.value,
            },
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

  private static calculateCurrentListCardRange(
    seats: Seat[],
    index: CarouselIndex,
  ): [number, number] {
    const listCardCount = this.countListCard(seats);
    const startIndex = index * this.LIST_CARD_ITEMS_MAX_COUNT;
    const isLastCarouselIndex = index === listCardCount - 1;

    if (isLastCarouselIndex) {
      if (listCardCount === 1) {
        const itemLastIndex = seats.length;
        return [startIndex, itemLastIndex];
      } else {
        const startIndexInLastListCard = index * this.LIST_CARD_ITEMS_MAX_COUNT;
        const remainingSeatsCount =
          seats.length % this.LIST_CARD_ITEMS_MAX_COUNT;
        const endIndex = startIndexInLastListCard + remainingSeatsCount;
        return [startIndex, endIndex];
      }
    } else {
      const endIndex = (index + 1) * this.LIST_CARD_ITEMS_MAX_COUNT;
      return [startIndex, endIndex];
    }
  }
}
