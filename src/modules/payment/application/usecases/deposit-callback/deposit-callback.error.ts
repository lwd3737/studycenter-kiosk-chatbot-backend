import { ApplicationError, UnknownError, UseCaseError } from 'src/core';

export type DepositCallbackError =
  | DepositFailed
  | PaymentNotFoundError
  | MemberNotFoundError
  | EventApiPublishFailed
  | UnknownError;

export class DepositFailed extends UseCaseError {
  constructor() {
    super(`Virtual account deposit failed`);
  }
}

export class PaymentNotFoundError extends ApplicationError<{
  orderId: string;
}> {
  constructor(orderId: string) {
    super(`Payment not found with orderId: ${orderId}`, { orderId });
  }
}

export class MemberNotFoundError extends ApplicationError<{
  memberId: string;
}> {
  constructor(memberId: string) {
    super(`Member not found with memberId: ${memberId}`, { memberId });
  }
}

export class EventApiPublishFailed extends UseCaseError {
  constructor(message: string) {
    super(`EventApiService publish error: ${message}`);
  }
}
