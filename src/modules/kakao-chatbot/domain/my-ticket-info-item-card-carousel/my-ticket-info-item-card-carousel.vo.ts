import { DomainError, Result, combine, err, ok } from 'src/core';
import { ItemCardCarousel } from '../basic-template-outputs/item-card-carousel/item-card-carousel.value-object';
import { ItemCard } from '../basic-template-outputs/item-card/item-card.value-object';
import { ItemList } from '../basic-template-outputs/item-card/item-list.value-object';
import {
  Button,
  ButtonActionType,
} from '../basic-template-outputs/button/button.value-object';

type MyTicketInfoItemCardCarouselProps = {
  myTicketsInfo: {
    title: string;
    totalUsageDuration: TotalUsageDuration;
    inUse: boolean;
    remainingTime: number;
    endAt?: Date | null;
  }[];
};
type TotalUsageDuration = {
  unit: 'DAYS' | 'HOURS';
  value: number;
};

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;

export class MyTicketInfoItemCardCarousel extends ItemCardCarousel {
  public static new(
    props: MyTicketInfoItemCardCarouselProps,
  ): Result<MyTicketInfoItemCardCarousel, DomainError> {
    const itemCardsOrError = combine(
      ...props.myTicketsInfo.map((info) => {
        const itemListOrError = this.createItemList(info);
        if (itemListOrError.isErr()) return err(itemListOrError.error);

        const buttonOrError = this.createButton();
        if (buttonOrError.isErr()) return err(buttonOrError.error);

        return ItemCard.create({
          head: { title: info.title },
          itemList: itemListOrError.value,
          buttons: [buttonOrError.value],
        });
      }),
    );
    if (itemCardsOrError.isErr()) return err(itemCardsOrError.error);

    return ok(
      this.create({
        items: itemCardsOrError.value,
      }),
    );
  }

  private static createItemList(
    info: MyTicketInfoItemCardCarouselProps['myTicketsInfo'][number],
  ): Result<ItemList[], DomainError> {
    const unit = info.totalUsageDuration.unit === 'DAYS' ? '일' : '시간';
    const totalDuration = `${info.totalUsageDuration.value}${unit}`;

    const itemListOrError = combine(
      ItemList.create({
        title: '총시간',
        description: totalDuration,
      }),
      ItemList.create({
        title: '남은시간',
        description: this.toRemainingTimeDisplay(
          info.remainingTime,
          info.totalUsageDuration.unit,
        ),
      }),
    );
    if (itemListOrError.isErr()) return err(itemListOrError.error);

    return ok(itemListOrError.value);
  }

  private static createButton(): Result<Button, DomainError> {
    const blockId = process.env.SELECT_TICKET_AND_GET_ALL_ROOMS_BLOCK_ID;
    if (!blockId) throw Error('CHECK_IN_BLOCK_ID is not defined');

    return Button.create({
      label: '이용권 사용하기',
      action: ButtonActionType.BLOCK,
      blockId,
    });
  }

  private static toRemainingTimeDisplay(
    reaminingTime: number,
    unit: TotalUsageDuration['unit'],
  ): string {
    if (unit === 'DAYS') return this.toDays(reaminingTime);
    return this.toHours(reaminingTime);
  }

  private static toDays(time: number): string {
    const days = Math.floor(time / DAY);
    const daysDisplay = days > 0 ? `${days}일 ` : '';
    const hours = Math.floor((time % DAY) / HOUR);
    const hoursDisplay = hours > 0 ? `${hours}시간 ` : '';
    const minutes = Math.floor((hours % HOUR) / MINUTE);
    const minutesDisplay = minutes > 0 ? `${minutes}분 ` : '';

    if (!days && !hours && !minutes) return '0분';
    return `${daysDisplay}${hoursDisplay}${minutesDisplay}`;
  }

  private static toHours(time: number): string {
    const hours = Math.floor(time / HOUR);
    const hoursDisplay = hours > 0 ? `${hours}시간 ` : '';
    const minutes = Math.floor((hours % HOUR) / MINUTE);
    const minutesDisplay = minutes > 0 ? `${minutes}분 ` : '';

    if (!hours && !minutes) return '0분';
    return `${hoursDisplay}${minutesDisplay}`;
  }
}
