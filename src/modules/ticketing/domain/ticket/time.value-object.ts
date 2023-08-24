import { DomainError, ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/core';
import { TicketErrors } from './ticket.error';

export interface TicketTimeProps {
  unit: TicketTimeUnitCategory;
  value: number;
}
export type TicketTimeUnitCategory = TicketTimeUnits[keyof TicketTimeUnits];
export type TicketTimeUnits = typeof TICKET_TIME_UNITS;

export const TICKET_TIME_UNITS = {
  days: 'days' as const,
  hours: 'hours' as const,
};

export class TicketTime extends ValueObject<TicketTimeProps> {
  public static create(
    props: TicketTimeProps,
  ): Result<TicketTime, DomainError> {
    if (this.isUnitValid(props.unit) === false)
      return err(new TicketErrors.InvalidTimeUnit(props.unit));
    if (this.isValueValid(props.value) === false)
      return err(new TicketErrors.InvalidTimeValue(props.value));

    return ok(
      new TicketTime({
        unit: props.unit as TicketTimeUnitCategory,
        value: props.value,
      }),
    );
  }

  public get unit(): TicketTimeUnitCategory {
    return this.props.unit;
  }

  public get value(): number {
    return this.props.value;
  }

  public get display(): string {
    const formattedUnit = this.unit === TICKET_TIME_UNITS.days ? '일' : '시간';
    return `${this.value}${formattedUnit}`;
  }

  private static isUnitValid(unit: string): boolean {
    return Object.values(TICKET_TIME_UNITS).includes(unit as any);
  }

  private static isValueValid(value: number): boolean {
    return value > 0 && Number.isInteger(value);
  }

  private constructor(props: TicketTimeProps) {
    super(props);
  }
}
