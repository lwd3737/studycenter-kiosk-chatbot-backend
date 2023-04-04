import { AggregateRoot, err, ok, Result } from 'src/core';
import { RoomErrors } from './room.error';
import { RoomId } from './room-id';
import { RoomNumber } from './room-number.value-object';
import { RoomType } from './room-type.value-object';
import { SeatsInfo } from './seats-infovalue-object';
import { SeatIds } from './seat-ids.value-object';
import { SeatId } from '../seat/seat-id';

export interface RoomProps {
  title: string;
  type: RoomType;
  number: RoomNumber;
  seatIds: SeatIds;
  seatsInfo: SeatsInfo;
}

type CreateNewProps = Pick<RoomProps, 'title' | 'type' | 'number'>;

type CreateFromExistingProps = RoomProps;

export class Room extends AggregateRoot<RoomProps> {
  get roomId(): RoomId {
    return new RoomId(this._id.value);
  }

  get type(): RoomType {
    return this.props.type;
  }

  get title(): string {
    return this.props.title;
  }

  get number(): RoomNumber {
    return this.props.number;
  }

  get seatIds(): SeatIds {
    return this.props.seatIds;
  }

  get seatsInfo(): SeatsInfo {
    return this.props.seatsInfo;
  }

  public addSeatIds(...seatIds: SeatId[]): void {
    const newSeatIds = this.props.seatIds.add(...seatIds);
    this.props.seatIds = newSeatIds;
  }

  public static createNew(
    props: CreateNewProps,
  ): Result<
    Room,
    | RoomErrors.SeatsTotalNumberNotEqualsSeatIdsNumberError
    | RoomErrors.SeatsTotalNumberNotIntegerOrNegativeNumberError
    | RoomErrors.SeatsAvailableNumberExceededTotalNumberError
    | RoomErrors.SeatsAvailableNumberNotIntegerOrNagativeNumberError
  > {
    const seatStatusResult = SeatsInfo.create({
      totalNumber: 0,
      availableNumber: 0,
    });
    if (seatStatusResult.isErr()) {
      return err(seatStatusResult.error);
    }

    return ok(
      new Room({
        ...props,
        seatIds: SeatIds.create(),
        seatsInfo: seatStatusResult.value,
      }),
    );
  }

  public static createFromExsiting(
    props: CreateFromExistingProps,
  ): Result<Room, RoomErrors.SeatsTotalNumberNotEqualsSeatIdsNumberError> {
    if (this.areSeatsTotalNumberAndSeatIdsNumberEquals(props) === false) {
      return err(new RoomErrors.SeatsTotalNumberNotEqualsSeatIdsNumberError());
    }

    return ok(new Room(props));
  }

  private static areSeatsTotalNumberAndSeatIdsNumberEquals(
    props: Pick<RoomProps, 'seatIds' | 'seatsInfo'>,
  ): boolean {
    return props.seatIds.count !== props.seatsInfo.totalNumber;
  }

  private constructor(props: RoomProps, id?: string) {
    super(props, id);
  }
}
