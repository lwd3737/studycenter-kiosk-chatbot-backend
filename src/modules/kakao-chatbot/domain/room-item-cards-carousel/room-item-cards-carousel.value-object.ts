import { combine, DomainError, err, ok, Result, ValueObject } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { SeatsInfo } from 'src/modules/seat-management/domain/room/seats-info.value-object';
import { Button, ButtonActionEnum } from '../base/button/button.value-object';
import {
  Carousel,
  CarouselTypeEnum,
} from '../base/carousel/carousel.value-object';
import { ItemCard } from '../base/item-card/item-card.value-object';
import { ItemList } from '../base/item-card/item-list.value-object';
import { ImageTitle } from '../base/item-card/image-title.value-object';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import { ItemListSummary } from '../base/item-card/item-list-summary.value-object';

type CreateProps = {
  roomSeatsGroup: RoomSeatsGroup[];
  ticketing?: Ticketing;
};

type RoomSeatsGroup = { room: Room; seats: Seat[] };

type Ticketing = {
  ticket_id: string;
};

export class RoomItemCardsCarousel extends ValueObject {
  public static create(props: CreateProps): Result<Carousel, DomainError> {
    const roomItemCardsOrError = this.createRoomItemCards(
      props.roomSeatsGroup,
      props.ticketing,
    );
    if (roomItemCardsOrError.isErr()) {
      return err(roomItemCardsOrError.error);
    }

    return Carousel.create({
      type: CarouselTypeEnum.ITEM_CARD,
      items: roomItemCardsOrError.value,
    });
  }

  private static createRoomItemCards(
    seatCollectionsByRoom: RoomSeatsGroup[],
    ticketing?: Ticketing,
  ): Result<ItemCard[], DomainError> {
    const roomItemCardOrErrors = seatCollectionsByRoom.map(
      (seatCollectionByRoom) => {
        const { room, seats } = seatCollectionByRoom;

        const roomProps = combine(
          this.createSeatsInfoItemList(room.seatsInfo),
          this.createSeatSummary(room.seatsInfo),
          this.createSelectRoomButton(room, ticketing),
        );
        if (roomProps.isErr()) {
          return err(roomProps.error);
        }
        const [seatsInfoItemList, seatSummary, SeatsViewButton] =
          roomProps.value;

        return ItemCard.create({
          isCarousel: true,
          imageTitle: ImageTitle.create({
            title: room.title,
          }),
          itemList: seatsInfoItemList,
          itemListAlignment: 'right',
          itemListSummary: seatSummary,
          title: '[이용가능한 좌석번호]',
          description: `${this.formatAvailableSeatNumbers(seats)}`,
          buttons: [SeatsViewButton],
        });
      },
    );

    const roomItemCardsOrError = combine(...roomItemCardOrErrors);
    if (roomItemCardsOrError.isErr()) {
      return err(roomItemCardsOrError.error);
    }

    return ok(roomItemCardsOrError.value);
  }

  private static createSeatsInfoItemList(
    seatsStatus: SeatsInfo,
  ): Result<ItemList[], DomainError> {
    const seatCountInUse = seatsStatus.totalCount - seatsStatus.availableCount;

    const itemListsOrError = combine(
      ItemList.create({
        title: '총좌석',
        description: `${seatsStatus.totalCount}`,
      }),
      ItemList.create({
        title: '이용가능좌석',
        description: `${seatsStatus.availableCount}`,
      }),
      ItemList.create({
        title: '이용불가좌석',
        description: `${seatCountInUse}`,
      }),
    );
    if (itemListsOrError.isErr()) return err(itemListsOrError.error);

    return ok(itemListsOrError.value);
  }

  private static createSeatSummary(
    seatsStatus: SeatsInfo,
  ): Result<ItemListSummary, DomainError> {
    const seatCountInUse = seatsStatus.totalCount - seatsStatus.availableCount;

    const summaryOrError = ItemListSummary.create({
      title: '좌석',
      description: `${seatCountInUse}/${seatsStatus.totalCount}`,
    });
    if (summaryOrError.isErr()) return err(summaryOrError.error);

    return ok(summaryOrError.value);
  }

  private static createSelectRoomButton(
    room: Room,
    ticketing?: Ticketing,
  ): Result<Button, DomainError> {
    if (ticketing) {
      return Button.create({
        label: `${room.title} 선택하기`,
        action: ButtonActionEnum.BLOCK,
        blockId: process.env.GET_AVAILABLE_SEATS_FOR_TICKETING_BLOCK_ID,
        messageText: `${room.title} 선택`,
        extra: {
          ticketing: {
            ticket_id: ticketing.ticket_id,
            room_id: room.id.value,
          },
        },
      });
    } else {
      return Button.create({
        label: `이용가능한 좌석보기`,
        action: ButtonActionEnum.MESSAGE,
        messageText: `이용가능한 좌석보기`,
      });
    }
  }

  private static formatAvailableSeatNumbers(seats: Seat[]): string {
    const availableSeats = seats.filter((seat) => seat.isAvailable);
    const availableSeatNumbers = availableSeats.map(
      (seat) => seat.number.value,
    );
    return availableSeatNumbers.join(', ');
  }
}
