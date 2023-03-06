import { ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/shared/utils';
import {
  InvalidTicketTimeUnitError,
  InvalidTicketTimeValueError,
} from './ticket-errors';

export interface TicketTimeVOProps {
  unit: TicketTimeUnit;
  value: number;
}

export enum TicketTimeUnit {
  DAYS = 'DAYS',
  HOURS = 'HOURS',
}

export class TicketTimeVO extends ValueObject<TicketTimeVOProps> {
  private constructor(props: TicketTimeVOProps) {
    super(props);
  }

  public static create({
    unit,
    value,
  }: {
    unit: string;
    value: number;
  }): Result<
    TicketTimeVO,
    InvalidTicketTimeUnitError | InvalidTicketTimeValueError
  > {
    if (this.isValidTimeUnit(unit) === false) {
      return err(new InvalidTicketTimeUnitError(unit));
    }

    if (this.isValidTimeValue(value) === false) {
      return err(new InvalidTicketTimeValueError(value));
    }

    return ok(new TicketTimeVO({ unit: unit as TicketTimeUnit, value }));
  }

  private static isValidTimeUnit(unit: string): boolean {
    return Object.values<string>(TicketTimeUnit).includes(unit);
  }

  private static isValidTimeValue(value: number): boolean {
    return value > 0 && Number.isInteger(value);
  }

  public get unit(): TicketTimeUnit {
    return this.props.unit;
  }

  public get time(): number {
    return this.props.value;
  }
}
