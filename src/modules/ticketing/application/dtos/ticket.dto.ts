import { TicketTimeUnit, TicketType } from '../../domain';
import { ExpirationType } from '../../domain/ticket/expiration.value-object';

export class TicketDTO {
  id: string;
  type: TicketType;
  isFixedSeat: boolean;
  time: TicketTimeDTO;
  price: number;
  expiration: {
    type: ExpirationType;
  };
}

export class TicketTimeDTO {
  unit: TicketTimeUnit;
  value: number;
}
