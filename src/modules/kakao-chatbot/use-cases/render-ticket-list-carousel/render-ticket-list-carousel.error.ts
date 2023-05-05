import { AppErrors } from 'src/core';
import { GetAllTicketCollectionsError } from 'src/modules/ticketing/application/use-cases/get-all-ticket-collection/get-all-ticket-collection.error';

export type RenderTicketListCarouselError =
  | AppErrors.UnexpectedError
  | GetAllTicketCollectionsError;
