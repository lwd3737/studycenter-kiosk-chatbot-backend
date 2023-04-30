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

  export class InvalidButtonLayoutWhenCarouselError extends DomainError {
    constructor() {
      super(`ItemCard ButtonLayout cannot be vertical when it is a carousel`);
    }
  }

  export class ButtonsMaxNumberExceededWhenLayoutVerticalError extends DomainError {
    constructor() {
      super(
        `Max Number of ItemCard Buttons is exceeded when layout is vertical`,
      );
    }
  }

  export class ButtonsMaxNumberExceededWhenLayoutHorizontalError extends DomainError {
    constructor() {
      super(
        `Max Number of ItemCard Buttons is exceeded when layout is horizontal`,
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
