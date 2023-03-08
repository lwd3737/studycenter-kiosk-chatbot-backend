/* eslint-disable @typescript-eslint/no-namespace */
import { AppError, DomainError } from 'src/core';
import { TicketNotFoundError } from './ticket-not-found.error';

export type GetAllTicketCollectionsError =
  | AppError
  | TicketNotFoundError
  | DomainError;

export namespace GetAllTicketCollectionsErrors {}
