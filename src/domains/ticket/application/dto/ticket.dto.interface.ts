import { TicketCategoryVO } from '../../domain/ticket-category.vo';

export interface ITicketDTO {
  id: string;
  category: TicketCategoryDTO;
  time: ITicketTimeDTO;
  price: number;
  discount?: ITicketDiscount;
}

export type TicketCategoryDTO = TicketCategoryVO;

export interface ITicketTimeDTO {
  unit: string;
  value: number;
}

export interface ITicketDiscount {
  type: string;
  price: number;
}
