import { DomainError } from 'src/core/domain';

export class InvalidTicketCategoryError implements DomainError {
  public message: string;
  public detail: any;

  constructor(category: string, error?: any) {
    this.message = `The category "${category}" is invalid. The category must be one of "PERIOD", "HOURS_RECHARGE", "SAME_DAY".`;
    this.detail = error;
  }
}

export class InvalidTicketTimeUnitError implements DomainError {
  public message: string;
  public detail: any;

  constructor(timeUnit: string, error?: any) {
    this.message = `The time unit "${timeUnit}" is invalid. The time unit must be one of "DAYS", "HOURS".`;
    this.detail = error;
  }
}

export class InvalidTicketTimeValueError implements DomainError {
  public message: string;
  public detail: any;

  constructor(timeValue: number, error?: any) {
    this.message = `The time value "${timeValue}" is invalid. The time value must be a positive integer.`;
    this.detail = error;
  }
}

export class MismatchedTicketCategoryAndTimeUnitError implements DomainError {
  public message: string;
  public detail: any;

  constructor(
    { category, timeUnit }: { category: string; timeUnit: string },
    error?: any,
  ) {
    this.message = `The category "${category}" does not match the tume unit "${timeUnit}"`;
    this.detail = error;
  }
}

export class InvalidTicketDiscountPriceError implements DomainError {
  public message: string;
  public detail: any;

  constructor(price: number, error?: any) {
    this.message = `The discount price "${price}" is invalid. The discount price must be a positive integer.`;
    this.detail = error;
  }
}

export class InvalidTicketPriceError implements DomainError {
  public message: string;
  public detail: any;

  constructor(price: number, error?: any) {
    this.message = `The price "${price}" is invalid. The price must be a positive integer.`;
    this.detail = error;
  }
}
