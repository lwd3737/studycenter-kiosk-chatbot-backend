/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors } from 'src/core';
import { TicketErrors } from 'src/modules/ticketing';
import { TicketCommerceCardsCarouselError } from '../../domain/ticket-commerce-cards-carousel/ticket-commerce-cards-carousel.error';

export type GetTicketCommerceCardsCarouselError =
  | AppErrors.UnexpectedError
  | TicketErrors.CategoryInvalidTypeError
  | TicketCommerceCardsCarouselError;

export namespace GetTicketCommerceCardsCarouselErrors {}
