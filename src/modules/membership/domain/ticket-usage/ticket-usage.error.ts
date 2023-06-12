import { DomainError } from 'src/core';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace TicketUsageErrors {
  export class InvalidTicketCategory extends DomainError {
    constructor(category: any) {
      super(`Invalid ticket category ${category}`);
    }
  }
}
