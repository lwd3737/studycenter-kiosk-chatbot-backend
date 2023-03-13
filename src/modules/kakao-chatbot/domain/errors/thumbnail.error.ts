/* eslint-disable @typescript-eslint/no-namespace */
import { DomainError } from 'src/core';

export type ThumbnailError =
  ThumbnailErrors.WidthOrHeightNotIncludedWhenFixRatioIncludedError;

export namespace ThumbnailErrors {
  export class WidthOrHeightNotIncludedWhenFixRatioIncludedError extends DomainError {
    constructor() {
      super(
        'Width or height thumbnail not included when fix ratio is included',
      );
    }
  }
}
