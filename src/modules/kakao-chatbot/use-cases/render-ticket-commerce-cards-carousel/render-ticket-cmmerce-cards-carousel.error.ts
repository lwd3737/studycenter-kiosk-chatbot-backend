/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors, DomainError } from 'src/core';

export type RenderTicketCommerceCardsCarouselError =
  | AppErrors.UnexpectedError
  | DomainError;

export namespace RenderTicketCommerceCardsCarouselErrors {}
