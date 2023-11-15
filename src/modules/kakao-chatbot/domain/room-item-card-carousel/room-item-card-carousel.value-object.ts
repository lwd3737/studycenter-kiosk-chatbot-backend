import { combine, DomainError, err, ok, Result } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { SeatsInfo } from 'src/modules/seat-management/domain/room/seats-info.value-object';
import {
  Button,
  ButtonActionType,
} from '../basic-template-outputs/button/button.value-object';
import { ItemCard } from '../basic-template-outputs/item-card/item-card.value-object';
import { ItemList } from '../basic-template-outputs/item-card/item-list.value-object';
import { ImageTitle } from '../basic-template-outputs/item-card/image-title.value-object';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.ar';
import { ItemListSummary } from '../basic-template-outputs/item-card/item-list-summary.value-object';
import { ItemCardCarousel } from '../basic-template-outputs/item-card-carousel/item-card-carousel.value-object';

type CreateProps = {
  blockId: string;
  rooms: RoomInfo[];
};
type RoomInfo = { room: Room; seats: Seat[] };

export class RoomItemCardCarousel extends ItemCardCarousel {
  public static new(
    props: CreateProps,
  ): Result<RoomItemCardCarousel, DomainError> {
    const roomItemCardsOrError = this.createRoomItemCards(
      props.blockId,
      props.rooms,
    );
    if (roomItemCardsOrError.isErr()) {
      return err(roomItemCardsOrError.error);
    }

    return ok(
      this.create({
        items: roomItemCardsOrError.value,
      }),
    );
  }

  private static createRoomItemCards(
    blockId: string,
    rooms: RoomInfo[],
  ): Result<ItemCard[], DomainError> {
    const roomItemCardOrErrors = rooms.map((seatCollectionByRoom) => {
      const { room, seats } = seatCollectionByRoom;

      const roomProps = combine(
        this.createSeatsInfoItemList(room.seatsInfo),
        this.createSeatSummary(room.seatsInfo),
        this.createButton(blockId, room),
      );
      if (roomProps.isErr()) {
        return err(roomProps.error);
      }
      const [seatsInfoItemList, seatSummary, SeatsViewButton] = roomProps.value;

      return ItemCard.create({
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
    });

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

  private static createButton(
    blockId: string,
    room: Room,
  ): Result<Button, DomainError> {
    return Button.create({
      label: `${room.title} 선택하기`,
      action: ButtonActionType.BLOCK,
      blockId,
      messageText: `${room.title} 선택`,
      extra: {
        roomId: room.id.value,
      },
    });
  }

  private static formatAvailableSeatNumbers(seats: Seat[]): string {
    const availableSeats = seats.filter((seat) => seat.available);
    const availableSeatNumbers = availableSeats.map(
      (seat) => seat.number.value,
    );
    return availableSeatNumbers.join(', ');
  }
}
