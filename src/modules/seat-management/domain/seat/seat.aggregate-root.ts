import { AggregateRoot } from 'src/core/domain';
import { RoomId } from '../room/room-id';
import { SeatId } from './seat-id';
import { SeatNumber } from './seat-number.value-object';
import { Result, combine, err, ok } from 'src/core';
import { SeatError } from './seat.error';

export interface SeatProps {
  roomId: RoomId;
  number: SeatNumber;
  isAvailable: boolean;
  // userInUse: UserId
}

type CreateNewProps = {
  roomId: string;
  number: number;
};

type CreateFromExistingProps = CreateNewProps & {
  isAvailable: boolean;
};

export class Seat extends AggregateRoot<SeatProps> {
  get seatId(): SeatId {
    return new SeatId(this._id.value);
  }

  get roomId(): RoomId {
    return this.props.roomId;
  }

  get number(): SeatNumber {
    return this.props.number;
  }

  get isAvailable(): boolean {
    return this.props.isAvailable;
  }

  public static createNew(props: CreateNewProps): Result<Seat, SeatError> {
    const propsOrError = combine(SeatNumber.create({ value: props.number }));
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [number] = propsOrError.value;

    return ok(
      new Seat({ roomId: new RoomId(props.roomId), number, isAvailable: true }),
    );
  }

  public static createFromExisiting(
    props: CreateFromExistingProps,
    id: string,
  ): Result<Seat, SeatError> {
    const propsOrError = combine(SeatNumber.create({ value: props.number }));
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [number] = propsOrError.value;

    return ok(
      new Seat(
        {
          roomId: new RoomId(props.roomId),
          number,
          isAvailable: props.isAvailable,
        },
        id,
      ),
    );
  }

  private constructor(props: SeatProps, id?: string) {
    super(props, id);
  }
}
