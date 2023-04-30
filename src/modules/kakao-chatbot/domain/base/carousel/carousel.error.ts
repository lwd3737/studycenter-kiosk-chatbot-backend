/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';
import { CarouselItem, CarouselTypeEnum } from './carousel.value-object';

export type CarouselError = CarouselErrors.TypeAndItemsMismatchedError;

export namespace CarouselErrors {
  export class TypeAndItemsMismatchedError extends DomainError {
    constructor(type: CarouselTypeEnum, items: CarouselItem[]) {
      const item = items[0];

      super(
        `Carousel type '${type}' and Items ${item?.constructor.name} not mismatched`,
      );
    }
  }
}
