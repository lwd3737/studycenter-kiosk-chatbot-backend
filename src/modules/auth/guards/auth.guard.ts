import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  IMemberRepo,
  Member,
  MemberRepoProvider,
} from 'src/modules/membership';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthExceptions } from '../auth-exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(MemberRepoProvider) private memberRepo: IMemberRepo,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    try {
      const member = await this.verify(req);
      req.member = member;

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async verify(req: Request): Promise<Member> {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    const authorizationKey = process.env.AUTHORIZATION_TOKEN;

    if (type !== 'Bearer') {
      throw new AuthExceptions.InvalidAuthorizationTypeError();
    }

    if (token !== authorizationKey) {
      throw new AuthExceptions.InvalidAuthorizationTokenError();
    }

    const appUserId = req.body.userRequest?.user?.properties?.appUserId ?? null;
    if (appUserId === null) {
      throw new AuthExceptions.AppUserIdNotExistError();
    }

    const member = await this.memberRepo.getByAppUserId(appUserId);
    if (member === null) {
      throw new AuthExceptions.MemberNotFoundError();
    }

    return member;
  }
}
