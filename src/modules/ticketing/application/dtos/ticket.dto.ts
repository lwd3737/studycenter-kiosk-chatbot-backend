import { TicketTimeUnitCategory } from '../../domain';

export class TicketDTO {
  id: string;
  type: TicketTypeDTO;
  isFixedSeat: boolean;
  time: TicketTimeDTO;
  price: number;
  expirationType: ExpierationTypeDTO;
}
export type TicketTypeDTO = 'period' | 'hoursRecharge' | 'sameDay';
export class TicketTimeDTO {
  unit: TicketTimeUnitCategory;
  value: number;
}
export type ExpierationTypeDTO = 'duration' | 'dueDate';
