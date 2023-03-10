import { ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/core';
import { TicketTimeError, TicketTimeErrors } from './errors';

export interface TicketTimeProps {
  unit: TTicketTimeUnit;
  value: number;
}

export enum TTicketTimeUnit {
  DAYS = 'DAYS',
  HOURS = 'HOURS',
}

export class TicketTime extends ValueObject<TicketTimeProps> {
  public get unit(): TTicketTimeUnit {
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
  }): Result<TicketTime, TicketTimeError> {
    if (this.isValidTimeUnit(unit) === false) {
      return err(new TicketTimeErrors.UnitInvalidError(unit));
    }

    if (this.isValidTimeValue(value) === false) {
      return err(new TicketTimeErrors.ValueInvalidError(value));
    }

    return ok(new TicketTime({ unit: unit as TTicketTimeUnit, value }));
  }

  private static isValidTimeUnit(unit: string): boolean {
    return Object.values<string>(TTicketTimeUnit).includes(unit);
  }

  private static isValidTimeValue(value: number): boolean {
    return value > 0 && Number.isInteger(value);
  }
}
