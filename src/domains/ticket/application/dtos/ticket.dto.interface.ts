export interface ITicketDTO {
  id: string;
  category: 'PERIOD' | 'HOURS_RECHARGE' | 'SAME_DAY';
  time: ITicketTimeDTO;
  price: number;
  discount?: ITicketDiscount;
}

export interface ITicketTimeDTO {
  unit: string;
  value: number;
}

export interface ITicketDiscount {
  type: string;
  price: number;
}
