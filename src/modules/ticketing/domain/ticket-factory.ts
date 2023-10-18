import {
  CreateFromExistingHoursRechargeTicketProps,
  CreateNewHoursRechargeTicketProps,
  HOURS_RECHARGE_TICKET_TYPE,
  HoursRechargeTicket,
  HoursRechargeTicketType,
} from './hours-recharge-ticket/hours-recharge-ticket.ar';
import {
  CreateFromExistingPeriodTicketProps,
  CreateNewPeriodTicketProps,
  PERIOD_TICKET_TYPE,
  PeriodTicket,
  PeriodTicketType,
} from './period-ticket/period-ticket.ar';
import {
  CreateFromExsitingSameDayTicketProps,
  CreateNewSameDayTicketProps,
  SAME_DAY_TICKET_TYPE,
  SameDayTicket,
  SameDayTicketType,
} from './same-day-ticket/same-day-ticket.ar';

export type TicketType =
  | PeriodTicketType
  | HoursRechargeTicketType
  | SameDayTicketType;

export class TicketFactory {
  public static new(
    type: string,
    props:
      | CreateNewPeriodTicketProps
      | CreateNewHoursRechargeTicketProps
      | CreateNewSameDayTicketProps,
  ) {
    switch (type) {
      case PERIOD_TICKET_TYPE:
        return PeriodTicket.new(props);
      case HOURS_RECHARGE_TICKET_TYPE:
        return HoursRechargeTicket.new(props);
      case SAME_DAY_TICKET_TYPE:
        return SameDayTicket.new(props);
      default:
        throw new Error(`invalid Ticket type:${type}`);
    }
  }

  public static from(
    type: string,
    props:
      | CreateFromExistingPeriodTicketProps
      | CreateFromExistingHoursRechargeTicketProps
      | CreateFromExsitingSameDayTicketProps,
    id: string,
  ) {
    switch (type) {
      case PERIOD_TICKET_TYPE:
        return PeriodTicket.from(props, id);
      case HOURS_RECHARGE_TICKET_TYPE:
        return HoursRechargeTicket.from(props, id);
      case SAME_DAY_TICKET_TYPE:
        return SameDayTicket.from(props, id);
      default:
        throw new Error(`invalid Ticket type:${type}`);
    }
  }
}
