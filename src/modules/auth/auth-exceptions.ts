import { UnauthorizedException } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace AuthExceptions {
  export class InvalidAuthorizationTypeError extends UnauthorizedException {
    constructor() {
      super('Invalid authorization type (Bearer required)');
    }
  }

  export class InvalidAuthorizationTokenError extends UnauthorizedException {
    constructor() {
      super('Invalid authorization key');
    }
  }

  export class AppUserIdNotExistError extends UnauthorizedException {
    constructor() {
      super('The appUserId not exist in the request body');
    }
  }

  export class MemberNotFoundError extends UnauthorizedException {
    constructor() {
      super('Member not found by appUserId');
    }
  }
}
