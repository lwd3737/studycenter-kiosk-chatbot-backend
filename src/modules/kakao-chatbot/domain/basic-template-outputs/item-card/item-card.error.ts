/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type ItemCardError = ItemCardErrors.ItemListTitleMaxLengthExceededError;

export namespace ItemCardErrors {
  export class ItemListEmptyError extends DomainError {
    constructor() {
      super(`ItemCard ItemList is empty`);
    }
  }

  export class ItemListTitleMaxLengthExceededError extends DomainError {
    constructor() {
      super(`Max length of ItemCard ItemList title is exceeded`);
    }
  }

  export class ItemListTitleNotIncludedWhenDescriptionExistError extends DomainError {
    constructor() {
      super(`ItemCard ItemList is not included when description exist`);
    }
  }

  export class ItemListTitleAndDescriptionMaxLengthExceededError extends DomainError {
    constructor() {
      super(
        `Max length of ItemCard title and description of ItemList is exceeded`,
      );
    }
  }

  export class ItemListSummaryTitleMaxLengthExceededError extends DomainError {
    constructor() {
      super(`Max length of ItemCard ItemListSummary title is exceeded`);
    }
  }

  export class ItemListSummaryDescriptionMaxLengthExceededError extends DomainError {
    constructor() {
      super(`Max length of ItemCard ItemListSummary description is exceeded`);
    }
  }
}
