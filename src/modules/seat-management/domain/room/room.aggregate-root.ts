import { AggregateRoot, combine, DomainError, err, ok, Result } from 'src/core';
import { RoomError, RoomErrors } from './room.error';
import { RoomId } from './room-id';
import { RoomNumber } from './room-number.value-object';
import { RoomType } from './room-type.value-object';
import { SeatsInfo } from './seats-info.value-object';
import { SeatIds } from './seat-ids.value-object';
import { Seat } from '../seat/seat.aggregate-root';
import { SeatId } from '../seat/seat-id';

export interface RoomProps {
  title: string;
  type: RoomType;
  number: RoomNumber;
  seatIds: SeatIds;
  seatsInfo: SeatsInfo;
}

type CreateNewProps = {
  title: string;
  type: string;
  number: number;
};

type CreateFromExistingProps = {
  title: string;
  type: string;
  number: number;
  seatIds: string[];
  seatsInfo: {
    totalCount: number;
    availableCount: number;
  };
};

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

  public addSeats(...seats: Seat[]): Result<null, DomainError> {
    const seatIds = (this.props.seatIds = this.props.seatIds.add(
      ...seats.map((seat) => seat.seatId),
    ));

    const newAvailableNumber = seats.reduce(
      (availableNumber, seat) =>
        seat.isAvailable ? availableNumber + 1 : availableNumber,
      0,
    );
    const seatsInfoResult = SeatsInfo.create({
      totalCount: this.props.seatsInfo.totalCount + seats.length,
      availableCount: this.props.seatsInfo.availableCount + newAvailableNumber,
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

  public static createNew(props: CreateNewProps): Result<Room, RoomError> {
    const propsOrError = combine(
      RoomType.create({ value: props.type }),
      RoomNumber.create({ value: props.number }),
      SeatsInfo.create({
        totalCount: 0,
        availableCount: 0,
      }),
    );
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [type, number, seatsInfo] = propsOrError.value;

    return ok(
      new Room({
        title: props.title,
        type,
        number,
        seatIds: SeatIds.create(),
        seatsInfo,
      }),
    );
  }

  public static createFromExisting(
    props: CreateFromExistingProps,
    id: string,
  ): Result<Room, RoomError> {
    const propsOrError = combine(
      RoomType.create({ value: props.type }),
      RoomNumber.create({ value: props.number }),
      SeatsInfo.create(props.seatsInfo),
    );
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [type, number, seatsInfo] = propsOrError.value;
    const seatIds = SeatIds.create({
      ids: props.seatIds.map((id) => new SeatId(id)),
    });

    if (
      this.areSeatsTotalNumberAndSeatIdsNumberNotEquals({ seatIds, seatsInfo })
    ) {
      return err(new RoomErrors.SeatsTotalNumberNotEqualsSeatIdsNumberError());
    }

    return ok(
      new Room(
        {
          title: props.title,
          type,
          number,
          seatIds,
          seatsInfo,
        },
        id,
      ),
    );
  }

  private static areSeatsTotalNumberAndSeatIdsNumberNotEquals(
    props: Pick<RoomProps, 'seatIds' | 'seatsInfo'>,
  ): boolean {
    return props.seatIds.length !== props.seatsInfo.totalCount;
  }

  private constructor(props: RoomProps, id?: string) {
    super(props, id);
  }
}
