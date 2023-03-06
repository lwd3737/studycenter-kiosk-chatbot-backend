import { DomainError } from 'src/core';

export class ValidationNotExecutedError extends DomainError {
  constructor() {
    super('Validation not executed');
  }
}
