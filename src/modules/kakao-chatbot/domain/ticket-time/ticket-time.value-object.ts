import { ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/core';
import { TicketErrors } from 'src/modules/ticketing/domain/errors/ticket.error';

export interface TicketTimeProps {
  unit: TicketTimeUnitEnum;
  value: number;
}

export enum TicketTimeUnitEnum {
  DAYS = 'DAYS',
  HOURS = 'HOURS',
}

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

  public static create({
    unit,
    value,
  }: {
    unit: string;
    value: number;
  }): Result<
    TicketTime,
    TicketErrors.TimeUnitInvalidError | TicketErrors.TimeValueInvalidError
  > {
    if (this.isValidTimeUnit(unit) === false) {
      return err(new TicketErrors.TimeUnitInvalidError(unit));
    }

    if (this.isValidTimeValue(value) === false) {
      return err(new TicketErrors.TimeValueInvalidError(value));
    }

    return ok(new TicketTime({ unit: unit as TicketTimeUnitEnum, value }));
  }

  private static isValidTimeUnit(unit: string): boolean {
    return Object.values<string>(TicketTimeUnitEnum).includes(unit);
  }

  private static isValidTimeValue(value: number): boolean {
    return value > 0 && Number.isInteger(value);
  }
}
