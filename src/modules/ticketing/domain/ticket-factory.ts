import { HoursRechargeTicket } from './hours-recharge-ticket/hours-recharge-ticket.aggregate-root';
import {
  HOURS_RECHARGE_TYPE,
  HoursRechargeType,
} from './hours-recharge-ticket/type.value-object';
import { PeriodTicket } from './period-ticket/period-ticket.aggregate-root';
import { PERIOD_TYPE, PeriodType } from './period-ticket/type.value-object';
import { SameDayTicket } from './same-day-ticket/same-day-ticket.aggregate-root';
import {
  SAME_DAY_TYPE,
  SameDayType,
} from './same-day-ticket/type.value-object';
import { CreateNewTicketProps } from './ticket/ticket.aggregate-root';

type FactoryProps = {
  type: string;
  props: CreateNewTicketProps;
};

export type TTicketType = PeriodType | HoursRechargeType | SameDayType;

export class TicketFactory {
  public static createNew(props: FactoryProps) {
    const { type, ...ticket } = props;

    switch (type) {
      case PERIOD_TYPE:
        return PeriodTicket.createNew(ticket.props);
      case HOURS_RECHARGE_TYPE:
        return HoursRechargeTicket.createNew(ticket.props);
      case SAME_DAY_TYPE:
        return SameDayTicket.createNew(ticket.props);
      default:
        throw new Error('invalid category');
    }
  }
}
