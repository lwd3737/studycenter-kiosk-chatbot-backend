import { combine, DomainError, err, ok, Result, ValueObject } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { SeatsInfo } from 'src/modules/seat-management/domain/room/seats-infovalue-object';
import { Button, ButtonActionEnum } from '../button/button.value-object';
import { Carousel, CarouselTypeEnum } from '../carousel/carousel.value-object';
import { ImageTitle } from '../item-card/image-title.value-object';
import { ItemCard } from '../item-card/item-card.value-object';
import { ItemList } from '../item-card/item-list.value-object';

type CreateProps = {
  rooms: Room[];
};

export class RoomItemCardsCarousel extends ValueObject<object> {
  public static create(props: CreateProps): Result<Carousel, DomainError> {
    const roomItemCardsResult = this.createRoomItemCards(props.rooms);
    if (roomItemCardsResult.isErr()) {
      return err(roomItemCardsResult.error);
    }

    return Carousel.create({
      type: CarouselTypeEnum.ITEM_CARD,
      items: roomItemCardsResult.value,
    });
  }

  private static createRoomItemCards(
    rooms: Room[],
  ): Result<ItemCard[], DomainError> {
    const roomItemCardResults = rooms.map((room) => {
      const roomProps = combine(
        this.createSeatsInfoItemList(room.seatsInfo),
        this.createSeatsViewButton(room.title),
      );
      if (roomProps.isErr()) {
        return err(roomProps.error);
      }
      const [seatsInfoItemList, SeatsViewButton] = roomProps.value;

      return ItemCard.create({
        imageTitle: ImageTitle.create({ title: room.title }),
        itemList: seatsInfoItemList,
        itemListAlignment: 'right',
        buttons: [SeatsViewButton],
        isCarousel: true,
      });
    });

    const roomItemCardsResult = combine(...roomItemCardResults);
    if (roomItemCardsResult.isErr()) {
      return err(roomItemCardsResult.error);
    }

    return ok(roomItemCardsResult.value);
  }

  private static createSeatsInfoItemList(
    seatsStatus: SeatsInfo,
  ): Result<ItemList[], DomainError> {
    const itemListResult = combine(
      ItemList.create({
        title: '좌석수',
        desciption: `${seatsStatus.availableNumber}/${seatsStatus.totalNumber}`,
      }),
    );
    if (itemListResult.isErr()) {
      return err(itemListResult.error);
    }

    return ok(itemListResult.value);
  }

  private static createSeatsViewButton(
    roomTitle: string,
  ): Result<Button, DomainError> {
    return Button.create({
      label: '좌석',
      action: ButtonActionEnum.MESSAGE,
      messageText: `${roomTitle} 좌석`,
    });
  }
}
