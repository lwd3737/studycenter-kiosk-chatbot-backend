import { TicketType, TicketTypeProps } from '../ticket/type.value-object';

type Props = TicketTypeProps<SameDayType>;

export const SAME_DAY_TYPE = 'sameDay';
export type SameDayType = typeof SAME_DAY_TYPE;

export class SameDayTicketType extends TicketType {
  public static create(): SameDayTicketType {
    return new SameDayTicketType({
      value: SAME_DAY_TYPE,
    });
  }

  private constructor(props: Props) {
    super(props);
  }

  get display() {
    return '당일권';
  }
}
