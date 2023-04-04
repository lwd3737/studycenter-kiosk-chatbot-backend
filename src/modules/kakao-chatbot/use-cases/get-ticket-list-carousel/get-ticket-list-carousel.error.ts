import { AppError } from 'src/core';
import { GetAllTicketCollectionsError } from 'src/modules/ticketing/application/errors/get-all-ticket-collection.error';

export type GetTicketListCarouselError =
  | AppError
  | GetAllTicketCollectionsError;
