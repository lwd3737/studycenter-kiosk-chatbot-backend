import { TicketType, TicketTypeProps } from '../ticket/type.value-object';

type Props = TicketTypeProps<SameDayType>;

export const SAME_DAY_TYPE = 'same_day';
export type SameDayType = typeof SAME_DAY_TYPE;

export class SameDayTicketType extends TicketType {
  get label() {
    return '당일권';
  }

  private constructor(props: Props) {
    super(props);
  }

  public static create(): SameDayTicketType {
    return new SameDayTicketType({
      value: SAME_DAY_TYPE,
    });
  }
}
