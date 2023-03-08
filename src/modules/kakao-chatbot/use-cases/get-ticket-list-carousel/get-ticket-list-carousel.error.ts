import { AppError } from 'src/core';
import { GetAllTicketCollectionsError } from 'src/modules/ticket/application/errors';

export type GetTicketListCarouselError =
  | AppError
  | GetAllTicketCollectionsError;
