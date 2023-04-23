/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors, DomainError } from 'src/core';
import { TicketErrors } from 'src/modules/ticketing';

export type GetTicketCommerceCardsCarouselError =
  | AppErrors.UnexpectedError
  | TicketErrors.CategoryInvalidTypeError
  | DomainError;

export namespace GetTicketCommerceCardsCarouselErrors {}
