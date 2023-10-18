import { DomainError, Result, err, ok } from 'src/core';
import { CreateTicketProps, Ticket, TicketProps } from '../ticket/ticket.ar';
import { TicketUsageDurationUnit } from '../ticket/usage-duration.vo';

type HoursRechargeTicketProps = TicketProps;
export type CreateNewHoursRechargeTicketProps = Pick<
  CreateTicketProps,
  'title' | 'price'
> & {
  usageDuration: number;
};
export type CreateFromExistingHoursRechargeTicketProps = CreateTicketProps;
export type HoursRechargeTicketType = typeof HOURS_RECHARGE_TICKET_TYPE;
export const HOURS_RECHARGE_TICKET_TYPE = 'HOURS_RECHARGE';

export class HoursRechargeTicket extends Ticket<HoursRechargeTicketProps> {
  public static new(
    props: CreateNewHoursRechargeTicketProps,
  ): Result<HoursRechargeTicket, DomainError> {
    return this.create({
      ...props,
      type: HOURS_RECHARGE_TICKET_TYPE,
      fixedSeat: false,
      usageDuration: {
        unit: TicketUsageDurationUnit.HOURS,
        value: props.usageDuration,
      },
    });
  }

  public static from(
    props: CreateFromExistingHoursRechargeTicketProps,
    id: string,
  ): Result<HoursRechargeTicket, DomainError> {
    return this.create(props, id);
  }

  protected static create(
    props: CreateTicketProps,
    id?: string,
  ): Result<HoursRechargeTicket, DomainError> {
    const propsOrError = this.createProps({
      ...props,
      type: HOURS_RECHARGE_TICKET_TYPE,
      fixedSeat: false,
    });
    if (propsOrError.isErr()) return err(propsOrError.error);

    return ok(new HoursRechargeTicket(propsOrError.value, id));
  }

  private constructor(props: HoursRechargeTicketProps, id?: string) {
    super(props, id);
  }

  get typeDisplay(): string {
    return '시간권';
  }

  get fullTitle(): string {
    return `(${this.typeDisplay})${this.title}`;
  }
}
