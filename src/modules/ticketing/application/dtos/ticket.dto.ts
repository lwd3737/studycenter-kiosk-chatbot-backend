import { TicketUsageDurationUnit } from '../../domain/ticket/usage-duration.vo';

export class TicketDTO {
  id: string;
  type: TicketTypeDTO;
  isFixedSeat: boolean;
  time: TicketTimeDTO;
  price: number;
}
export type TicketTypeDTO = 'period' | 'hoursRecharge' | 'sameDay';
export class TicketTimeDTO {
  unit: TicketUsageDurationUnit;
  value: number;
}
