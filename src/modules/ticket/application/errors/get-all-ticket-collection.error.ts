/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from 'src/core';
import { TicketError } from '../../domain';
import { TicketNotFoundError } from './ticket-not-found.error';

export type GetAllTicketCollectionsError =
  | AppError
  | TicketNotFoundError
  | TicketError;

export namespace GetAllTicketCollectionsErrors {}
