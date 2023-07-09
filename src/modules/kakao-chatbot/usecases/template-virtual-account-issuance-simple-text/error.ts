import { AppErrors, DomainError, UseCaseError } from 'src/core';

export type TemplateVirtualAccountIssuanceError =
  | AppErrors.UnexpectedError
  | MemberNotFound
  | TicketNotFound
  | DomainError;

class MemberNotFound extends UseCaseError {
  constructor(appUserId: string) {
    super(`Member appUserId(${appUserId}) not found`);
  }
}

class TicketNotFound extends UseCaseError {
  constructor(id: string) {
    super(`Ticket id(${id}) not found`);
  }
}

export const TemplateVirtualAccountIssuanceErrors = {
  MemberNotFound,
  TicketNotFound,
};
