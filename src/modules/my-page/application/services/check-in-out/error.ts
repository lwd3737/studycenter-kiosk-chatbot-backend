import { AppError } from 'src/core';

const ERROR_TYPE = 'CheckInOutServiceError';

export class NoCheckInError extends AppError {
  constructor(message: string) {
    super(`[${ERROR_TYPE}]${message}`);
  }
}
