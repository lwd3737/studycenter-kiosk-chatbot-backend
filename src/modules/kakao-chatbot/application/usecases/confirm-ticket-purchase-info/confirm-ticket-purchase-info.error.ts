import { DomainError, UnknownError } from 'src/core';
import { TicketNotFoundError } from '../issue-virtual-account/issue-virtual-account.error';

export type ConfirmTicketPurchaseInfoError =
  | TicketNotFoundError
  | DomainError
  | UnknownError;
