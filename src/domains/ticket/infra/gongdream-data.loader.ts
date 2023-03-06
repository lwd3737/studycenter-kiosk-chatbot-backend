import gongdream_tickets from './persistence/gongdream-ticket.data.json';

export const GongDreamTicketsToken = Symbol('gongdream-tickets');

export type GongDreamTicket = ReturnType<typeof loadGongDreamTickets>[number];

export const loadGongDreamTickets = () => {
  return gongdream_tickets;
};
