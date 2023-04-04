/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type ItemCardError = ItemCardErrors.ItemListTitleMaxLengthExceededError;

export namespace ItemCardErrors {
  export class ItemListTitleMaxLengthExceededError extends DomainError {
    constructor() {
      super(`Max length of ItemList title is exceeded`);
    }
  }

  export class ItemListTitleNotIncludedWhenDescriptionExistError extends DomainError {
    constructor() {
      super(`ItemList is not included when description exist`);
    }
  }

  export class ItemListTitleAndDescriptionMaxLengthExceededError extends DomainError {
    constructor() {
      super(`Max length of title and description of ItemList is exceeded`);
    }
  }

  export class InvalidButtonLayoutWhenCarouselError extends DomainError {
    constructor() {
      super(`ButtonLayout cannot be vertical when it is a carousel`);
    }
  }

  export class ButtonsMaxNumberExceededWhenLayoutVerticalError extends DomainError {
    constructor() {
      super(`Max Number of Buttons is exceeded when layout is vertical`);
    }
  }

  export class ButtonsMaxNumberExceededWhenLayoutHorizontalError extends DomainError {
    constructor() {
      super(`Max Number of Buttons is exceeded when layout is horizontal`);
    }
  }
}
