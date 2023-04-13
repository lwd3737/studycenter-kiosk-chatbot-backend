import { AggregateRoot } from 'src/core/domain';
import { RoomId } from '../room/room-id';
import { SeatId } from './seat-id';
import { SeatNumber } from './seat-number.value-object';

export interface SeatProps {
  roomId: RoomId;
  number: SeatNumber;
  isAvailable: boolean;
  // userInUse: UserId
}

type CreateNewProps = Pick<SeatProps, 'roomId' | 'number'>;

type CreateFromExistingProps = SeatProps;

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

  public static createNew(props: CreateNewProps): Seat {
    return new Seat({ ...props, isAvailable: true });
  }

  public static createFromExisiting(
    props: CreateFromExistingProps,
    id: string,
  ): Seat {
    return new Seat(props, id);
  }

  private constructor(props: SeatProps, id?: string) {
    super(props, id);
  }
}
