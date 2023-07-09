import {
  CreateHoursRechargeTicketProps,
  HoursRechargeTicket,
} from './hours-recharge-ticket/hours-recharge-ticket.aggregate-root';
import {
  HOURS_RECHARGE_TYPE,
  HoursRechargeType,
} from './hours-recharge-ticket/type.value-object';
import {
  CreatePeriodTicketProps,
  PeriodTicket,
} from './period-ticket/period-ticket.aggregate-root';
import { PERIOD_TYPE, PeriodType } from './period-ticket/type.value-object';
import {
  CreateSameDayTicketProps,
  SameDayTicket,
} from './same-day-ticket/same-day-ticket.aggregate-root';
import {
  SAME_DAY_TYPE,
  SameDayType,
} from './same-day-ticket/type.value-object';

export type TicketTypeKind = PeriodType | HoursRechargeType | SameDayType;
type CreateTicketPropsKind =
  | CreatePeriodTicketProps
  | CreateHoursRechargeTicketProps
  | CreateSameDayTicketProps;

export class TicketFactory {
  public static new(type: string, props: CreateTicketPropsKind) {
    switch (type) {
      case PERIOD_TYPE:
        return PeriodTicket.new(props);
      case HOURS_RECHARGE_TYPE:
        return HoursRechargeTicket.new(props);
      case SAME_DAY_TYPE:
        return SameDayTicket.new(props);
      default:
        throw new Error(`invalid Ticket type:${type}`);
    }
  }

  public static from(type: string, props: CreateTicketPropsKind, id: string) {
    switch (type) {
      case PERIOD_TYPE:
        return PeriodTicket.from(props as CreatePeriodTicketProps, id);
      case HOURS_RECHARGE_TYPE:
        return HoursRechargeTicket.from(props, id);
      case SAME_DAY_TYPE:
        return SameDayTicket.from(props, id);
      default:
        throw new Error(`invalid Ticket type:${type}`);
    }
  }
}
