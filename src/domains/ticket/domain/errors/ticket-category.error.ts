import { DomainError } from 'src/core';

export type TicketCategoryError = CategoryInvalidError;

class CategoryInvalidError extends DomainError {
  constructor(category: string) {
    super(
      `The category "${category}" is invalid. The category must be one of "PERIOD", "HOURS_RECHARGE", "SAME_DAY".`,
    );
  }
}

export const TicketCategoryErrors = {
  CategoryInvalidError,
};
