export class TicketDTO {
  id: string;
  category: 'PERIOD' | 'HOURS_RECHARGE' | 'SAME_DAY';
  time: TicketTimeDTO;
  price: number;
  discount?: TicketDiscount;
}

export class TicketTimeDTO {
  unit: string;
  value: number;
}

export class TicketDiscount {
  type: string;
  price: number;
}
