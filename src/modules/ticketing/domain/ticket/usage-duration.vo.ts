import { DomainError, ValueObject } from 'src/core/domain';
import { err, ok, Result } from 'src/core';
import { TicketErrors } from './ticket.error';

export interface TicketUsageDurationProps {
  unit: TicketUsageDurationUnit;
  value: number;
}
export type CreateTicketUsageDurationProps = {
  unit: TicketUsageDurationUnit | string;
  value: number;
};
export enum TicketUsageDurationUnit {
  DAYS = 'DAYS',
  HOURS = 'HOURS',
}
export type UsageStartAt = Date;

export class TicketUsageDuration extends ValueObject<TicketUsageDurationProps> {
  public static create(
    props: CreateTicketUsageDurationProps,
  ): Result<TicketUsageDuration, DomainError> {
    if (!this.isUnitValid(props.unit))
      return err(new TicketErrors.InvalidUsageDurationUnit(props.unit));
    if (this.isValueInvalid(props.value))
      return err(new TicketErrors.InvalidTimeValue(props.value));
    return ok(
      new TicketUsageDuration({
        ...props,
        unit: TicketUsageDurationUnit[props.unit],
      }),
    );
  }

  private static isUnitValid(unit: string): unit is TicketUsageDurationUnit {
    return Object.values(TicketUsageDurationUnit).includes(unit as any);
  }

  private static isValueInvalid(value: number): boolean {
    return value < 0 || !Number.isInteger(value);
  }

  protected constructor(props: TicketUsageDurationProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  get unit(): TicketUsageDurationUnit {
    return this.props.unit;
  }

  get unitDisplay(): string {
    return this.props.unit === TicketUsageDurationUnit.DAYS ? '일' : '시간';
  }

  get display(): string {
    return `${this.props.value}${this.unitDisplay}`;
  }
}
