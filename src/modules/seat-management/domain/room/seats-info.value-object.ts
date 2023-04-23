import { err, ok, Result, ValueObject } from 'src/core';
import { RoomErrors } from './room.error';

export interface SeatsInfoProps {
  totalNumber: number;
  availableNumber: number;
}

export class SeatsInfo extends ValueObject<SeatsInfoProps> {
  get totalNumber(): number {
    return this.props.totalNumber;
  }

  get availableNumber(): number {
    return this.props.availableNumber;
  }

  public static create(
    props: SeatsInfoProps,
  ): Result<
    SeatsInfo,
    | RoomErrors.SeatsTotalNumberNotIntegerOrNegativeNumberError
    | RoomErrors.SeatsAvailableNumberNotIntegerOrNagativeNumberError
  > {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new SeatsInfo(props));
  }

  private static validate(
    props: SeatsInfoProps,
  ): Result<
    null,
    | RoomErrors.SeatsTotalNumberNotIntegerOrNegativeNumberError
    | RoomErrors.SeatsAvailableNumberNotIntegerOrNagativeNumberError
  > {
    const { totalNumber, availableNumber } = props;

    if (Number.isInteger(totalNumber) === false || totalNumber < 0) {
      return err(
        new RoomErrors.SeatsTotalNumberNotIntegerOrNegativeNumberError(
          totalNumber,
        ),
      );
    }

    if (Number.isInteger(availableNumber) === false || availableNumber < 0) {
      return err(
        new RoomErrors.SeatsAvailableNumberNotIntegerOrNagativeNumberError(
          availableNumber,
        ),
      );
    }

    if (totalNumber < availableNumber) {
      return err(new RoomErrors.SeatsAvailableNumberExceededTotalNumberError());
    }

    return ok(null);
  }

  private constructor(props: SeatsInfoProps) {
    super(props);
  }
}
