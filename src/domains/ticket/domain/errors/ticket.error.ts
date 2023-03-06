import { DomainError } from 'src/core';

export type TicketError = CategoryAndTimeUnitMismatchedError;

class CategoryAndTimeUnitMismatchedError extends DomainError {
  constructor(props: { category: string; timeUnit: string }) {
    super(
      `The category "${props.category}" does not match the tume unit "${props.timeUnit}"`,
    );
  }
}

export const TicketErrors = {
  CategoryAndTimeUnitMismatchedError,
};
