import { err, ok, Result, ValueObject } from 'src/core';
import { RoomErrors } from './room.error';

export interface RoomNumberProps {
  value: number;
}

export class RoomNumber extends ValueObject<RoomNumberProps> {
  get value(): number {
    return this.props.value;
  }

  public static create(
    props: RoomNumberProps,
  ): Result<RoomNumber, RoomErrors.RoomNumberNotPositiveIntegerError> {
    if (this.isNotPositiveInteger(props.value)) {
      return err(new RoomErrors.RoomNumberNotPositiveIntegerError(props.value));
    }

    return ok(new RoomNumber(props));
  }

  private static isNotPositiveInteger(value: number): boolean {
    return Number.isInteger(value) === false || value < 1;
  }

  private constructor(props: RoomNumberProps) {
    super(props);
  }
}
