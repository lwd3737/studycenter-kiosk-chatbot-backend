/* eslint-disable @typescript-eslint/no-namespace */
import { AppErrors } from 'src/core';
import { TicketCategoryError } from 'src/modules/ticket';
import { TicketCommerceCardsCarouselError } from '../../domain';

export type GetTicketCommerceCardsCarouselError =
  | AppErrors.UnexpectedError
  | TicketCategoryError
  | TicketCommerceCardsCarouselError;

export namespace GetTicketCommerceCardsCarouselErrors {}
