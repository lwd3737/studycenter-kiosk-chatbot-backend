import { AppErrors } from 'src/core';
import { GetAllTicketCollectionsError } from 'src/modules/ticketing/application/usecases/get-all-ticket-collection/get-all-ticket-collection.error';

export type RenderTicketCollectionListCarouselError =
  | AppErrors.UnexpectedError
  | GetAllTicketCollectionsError;
