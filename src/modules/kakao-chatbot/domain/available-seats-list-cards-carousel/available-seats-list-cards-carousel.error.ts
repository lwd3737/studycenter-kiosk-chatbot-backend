/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export namespace AvailableSeatsListCardsCarouselErrors {
  export class SeatsMaxCountExceededError extends DomainError {
    constructor() {
      super('Seats max count exceeded');
    }
  }

  export class UnavailableSeatExistsError extends DomainError {
    constructor() {
      super('Unavailable seat(count:${}) exists');
    }
  }
}
