import { ApplicationError } from 'src/core';

export class MemberNotFoundByIdError extends ApplicationError {
  constructor(id: string) {
    super(`Member with id(${id}) not found`);
  }
}

export class MemberNotFoundByAppUserIdError extends ApplicationError {
  constructor(appUserId: string) {
    super(`Member with appUserId(${appUserId}) not found`);
  }
}
