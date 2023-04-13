import { AggregateRoot, DomainError, err, ok, Result } from 'src/core';
import { RoomErrors } from './room.error';
import { RoomId } from './room-id';
import { RoomNumber } from './room-number.value-object';
import { RoomType } from './room-type.value-object';
import { SeatsInfo } from './seats-infovalue-object';
import { SeatIds } from './seat-ids.value-object';
import { Seat } from '../seat/seat.aggregate-root';

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

  public addSeat(...seats: Seat[]): Result<null, DomainError> {
    const seatIds = (this.props.seatIds = this.props.seatIds.add(
      ...seats.map((seat) => seat.seatId),
    ));

    const newAvailableNumber = seats.reduce(
      (availableNumber, seat) =>
        seat.isAvailable ? availableNumber + 1 : availableNumber,
      0,
    );
    const seatsInfoResult = SeatsInfo.create({
      totalNumber: this.props.seatsInfo.totalNumber + seats.length,
      availableNumber:
        this.props.seatsInfo.availableNumber + newAvailableNumber,
    });
    if (seatsInfoResult.isErr()) {
      return err(seatsInfoResult.error);
    }
    const seatsInfo = seatsInfoResult.value;

    this.props.seatsInfo = seatsInfo;

    if (
      Room.areSeatsTotalNumberAndSeatIdsNumberNotEquals({
        seatIds,
        seatsInfo,
      })
    ) {
      return err(new RoomErrors.SeatsTotalNumberNotEqualsSeatIdsNumberError());
    }

    return ok(null);
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
    const seatsInfoResult = SeatsInfo.create({
      totalNumber: 0,
      availableNumber: 0,
    });
    if (seatsInfoResult.isErr()) {
      return err(seatsInfoResult.error);
    }

    return ok(
      new Room({
        ...props,
        seatIds: SeatIds.create(),
        seatsInfo: seatsInfoResult.value,
      }),
    );
  }

  public static createFromExisting(
    props: CreateFromExistingProps,
    id: string,
  ): Result<Room, RoomErrors.SeatsTotalNumberNotEqualsSeatIdsNumberError> {
    if (this.areSeatsTotalNumberAndSeatIdsNumberNotEquals(props)) {
      return err(new RoomErrors.SeatsTotalNumberNotEqualsSeatIdsNumberError());
    }

    return ok(new Room(props, id));
  }

  private static areSeatsTotalNumberAndSeatIdsNumberNotEquals(
    props: Pick<RoomProps, 'seatIds' | 'seatsInfo'>,
  ): boolean {
    return props.seatIds.length !== props.seatsInfo.totalNumber;
  }

  private constructor(props: RoomProps, id?: string) {
    super(props, id);
  }
}
