import { TicketType, TicketTypeProps } from '../ticket/type.value-object';

type Props = TicketTypeProps<HoursRechargeType>;

export const HOURS_RECHARGE_TYPE = 'hours_recharge';
export type HoursRechargeType = typeof HOURS_RECHARGE_TYPE;

export class HoursRechargeTicketType extends TicketType {
  get label() {
    return '시간권';
  }

  private constructor(props: Props) {
    super(props);
  }

  public static create(): HoursRechargeTicketType {
    return new HoursRechargeTicketType({
      value: HOURS_RECHARGE_TYPE,
    });
  }
}
