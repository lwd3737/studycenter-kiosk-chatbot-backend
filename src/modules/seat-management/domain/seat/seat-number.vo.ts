import { err, ok, Result, ValueObject } from 'src/core';
import { SeatErrors } from './seat.error';

export interface SeatNumberProps {
  value: number;
}

export class SeatNumber extends ValueObject<SeatNumberProps> {
  get value(): number {
    return this.props.value;
  }

  public static create(
    props: SeatNumberProps,
  ): Result<SeatNumber, SeatErrors.NumberNotPositiveIntegerError> {
    if (this.isNotPositiveInteger(props.value)) {
      return err(new SeatErrors.NumberNotPositiveIntegerError(props.value));
    }

    return ok(new SeatNumber(props));
  }

  private static isNotPositiveInteger(value: number): boolean {
    return Number.isInteger(value) === false || value < 1;
  }

  private constructor(props: SeatNumberProps) {
    super(props);
  }
}
