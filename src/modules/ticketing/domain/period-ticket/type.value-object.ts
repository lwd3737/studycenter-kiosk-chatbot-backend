import { TicketType, TicketTypeProps } from '../ticket/type.value-object';

type Props = TicketTypeProps<PeriodType>;
export const PERIOD_TYPE = 'period';
export type PeriodType = typeof PERIOD_TYPE;

export class PeriodTicketType extends TicketType {
  get display() {
    return '정기권';
  }

  private constructor(props: Props) {
    super(props);
  }

  public static create(): PeriodTicketType {
    return new PeriodTicketType({
      value: PERIOD_TYPE,
    });
  }
}
