import { AppError } from 'src/core';
import { GetAllTicketCollectionsError } from 'src/domains/ticket/application/errors';

export type GetTicketListCarouselError =
  | AppError
  | GetAllTicketCollectionsError;
