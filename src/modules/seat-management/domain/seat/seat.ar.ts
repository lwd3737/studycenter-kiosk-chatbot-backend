import { AggregateRoot, DomainError } from 'src/core/domain';
import { RoomId } from '../room/room-id';
import { SeatId } from './seat-id';
import { SeatNumber } from './seat-number.vo';
import { Result, combine, err, ok } from 'src/core';
import { SeatError } from './seat.error';
import { RoomNumber } from '../room/room-number.value-object';

export interface SeatProps {
  roomId: RoomId;
  roomNumber: RoomNumber;
  number: SeatNumber;
  available: boolean;
  memberIdInUse: string | null;
}
type CreateNewProps = {
  roomId: string;
  number: number;
  roomNumber: number;
};
type CreateFromExistingProps = CreateProps;
type CreateProps = Pick<SeatProps, 'available' | 'memberIdInUse'> &
  CreateNewProps;

const ERROR_TYPE = `[SeatError]`;

export class Seat extends AggregateRoot<SeatProps> {
  get seatId(): SeatId {
    return new SeatId(this._id.value);
  }

  get roomId(): RoomId {
    return this.props.roomId;
  }

  get roomNumber(): RoomNumber {
    return this.props.roomNumber;
  }

  get number(): SeatNumber {
    return this.props.number;
  }

  get available(): boolean {
    return this.props.available;
  }

  get memberIdInUse(): string | null {
    return this.props.memberIdInUse;
  }

  public static new(props: CreateNewProps): Result<Seat, SeatError> {
    return this.create({ ...props, available: true, memberIdInUse: null });
  }

  public static from(
    props: CreateFromExistingProps,
    id: string,
  ): Result<Seat, SeatError> {
    return this.create(props, id);
  }

  public static create(
    props: CreateProps,
    id?: string,
  ): Result<Seat, SeatError> {
    if (
      (props.available && props.memberIdInUse) ||
      (!props.available && !props.memberIdInUse)
    )
      return err(
        new DomainError(
          `${ERROR_TYPE}available and memberIdInUse is mismatched`,
        ),
      );

    const propsOrError = combine(
      RoomNumber.create({ value: props.roomNumber }),
      SeatNumber.create({ value: props.number }),
    );
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [roomNumber, number] = propsOrError.value;

    return ok(
      new Seat(
        {
          roomId: new RoomId(props.roomId),
          roomNumber,
          number,
          available: props.available,
          memberIdInUse: props.memberIdInUse,
        },
        id,
      ),
    );
  }

  private constructor(props: SeatProps, id?: string) {
    super(props, id);
  }

  public assignToMember(memberId: string): Result<true, DomainError> {
    if (!this.props.available)
      return err(new DomainError(`${ERROR_TYPE}Seat is not available`));

    this.props.memberIdInUse = memberId;
    this.props.available = false;

    return ok(true);
  }

  public unassignSeatFromMember(): Result<{ memberId: string }, DomainError> {
    if (this.available)
      return err(new DomainError(`${ERROR_TYPE}Seat is already available`));
    if (!this.memberIdInUse)
      return err(
        new DomainError(`${ERROR_TYPE}Seat is not assigned to member`),
      );

    const memberId = this.memberIdInUse;
    this.props.memberIdInUse = null;
    this.props.available = true;

    return ok({
      memberId,
    });
  }
}
