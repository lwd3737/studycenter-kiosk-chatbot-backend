import { DomainError, ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/core';
import { TicketErrors } from './ticket.error';

export interface TicketTimeProps {
  unit: TicketTimeUnit;
  value: number;
}
export const TICKET_TIME_UNIT = {
  days: 'days' as const,
  hours: 'hours' as const,
};
export type TicketTimeUnit =
  | typeof TICKET_TIME_UNIT.days
  | typeof TICKET_TIME_UNIT.hours;
export type CreateTicketTimeProps = {
  unit: string;
  value: number;
};

export class TicketTime extends ValueObject<TicketTimeProps> {
  public get unit(): TicketTimeUnit {
    return this.props.unit;
  }

  public get value(): number {
    return this.props.value;
  }

  private constructor(props: TicketTimeProps) {
    super(props);
  }

  public static create(
    props: CreateTicketTimeProps,
  ): Result<TicketTime, DomainError> {
    if (this.isUnitValid(props.unit) === false)
      return err(new TicketErrors.InvalidTimeUnit(props.unit));
    if (this.isValueValid(props.value) === false)
      return err(new TicketErrors.InvalidTimeValue(props.value));

    return ok(
      new TicketTime({
        unit: props.unit as TicketTimeUnit,
        value: props.value,
      }),
    );
  }

  private static isUnitValid(unit: string): boolean {
    return Object.values(TICKET_TIME_UNIT).includes(unit as any);
  }

  private static isValueValid(value: number): boolean {
    return value > 0 && Number.isInteger(value);
  }
}
