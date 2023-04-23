import { ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/core';
import { TicketErrors } from './ticket.error';

export interface TicketTimeProps {
  unit: TicketTimeUnitEnum;
  value: number;
}

export enum TicketTimeUnitEnum {
  DAYS = 'DAYS',
  HOURS = 'HOURS',
}

type CreateProps = {
  unit: string;
  value: number;
};

export class TicketTime extends ValueObject<TicketTimeProps> {
  public get unit(): TicketTimeUnitEnum {
    return this.props.unit;
  }

  public get value(): number {
    return this.props.value;
  }

  private constructor(props: TicketTimeProps) {
    super(props);
  }

  public static create(
    props: CreateProps,
  ): Result<
    TicketTime,
    TicketErrors.TimeUnitInvalidError | TicketErrors.TimeValueInvalidError
  > {
    if (this.isTimeUnitValid(props.unit) === false) {
      return err(new TicketErrors.TimeUnitInvalidError(props.unit));
    }

    if (this.isTimeValueValid(props.value) === false) {
      return err(new TicketErrors.TimeValueInvalidError(props.value));
    }

    return ok(
      new TicketTime({
        unit: props.unit as TicketTimeUnitEnum,
        value: props.value,
      }),
    );
  }

  private static isTimeUnitValid(unit: string): boolean {
    return Object.values<string>(TicketTimeUnitEnum).includes(unit);
  }

  private static isTimeValueValid(value: number): boolean {
    return value > 0 && Number.isInteger(value);
  }
}
