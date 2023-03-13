/* eslint-disable @typescript-eslint/no-namespace */

import { AppErrors } from 'src/core';
import { TicketNotFoundError } from './ticket-not-found.error';

export type GetTicketCollectionByCategoryError =
  | AppErrors.UnexpectedError
  | TicketNotFoundError;

export namespace GetTicketCollectionByCategoryErrors {}
