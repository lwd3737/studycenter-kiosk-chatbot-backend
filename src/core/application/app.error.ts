import { DomainError } from '../domain/domain-error.interface';

export class UnexpectedError implements DomainError {
  public message = 'An unexpected error occurred';
  public detail: any;

  constructor(error: any) {
    this.detail = error;
  }
}
