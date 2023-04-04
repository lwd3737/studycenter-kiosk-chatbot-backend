import { AppErrors } from 'src/core';
import { GetTicketByTimeErrors } from 'src/modules/ticketing/application/errors/get-ticket-by-time.error';

export type SelectTicketSimpleTextError =
  | AppErrors.UnexpectedError
  | GetTicketByTimeErrors.TicketNotFoundError;
