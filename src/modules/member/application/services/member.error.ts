import { AppError } from 'src/core';

export class MemberNotFoundByIdError extends AppError {
  constructor(id: string) {
    super(`Member with id(${id}) not found`);
  }
}

export class MemberNotFoundByAppUserIdError extends AppError {
  constructor(appUserId: string) {
    super(`Member with appUserId(${appUserId}) not found`);
  }
}
