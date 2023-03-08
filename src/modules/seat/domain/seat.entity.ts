import { AggregateRoot } from 'src/core/domain';

export interface SeatEntity {
  number: number;
  space: SeatType;
  inUse: boolean;
}

export enum SeatType {
  READING_ROOM = 'READING_ROOM',
  CAFE = 'CAFE',
  SIGLE = 'SINGLE',
  VIP = 'VIP',
}

export class TicketSeatVO extends AggregateRoot<SeatEntity> {
  private constructor(props: SeatEntity, id?: string) {
    super(props, id);
  }

  static create(props: SeatEntity, id?: string): TicketSeatVO {
    return new TicketSeatVO(props, id);
  }
}
