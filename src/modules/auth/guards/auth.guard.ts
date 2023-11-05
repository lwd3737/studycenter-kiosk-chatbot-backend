import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Member, MemberService } from 'src/modules/member';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthExceptions } from '../auth-exceptions';
import { CustomConfigService } from 'src/modules/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: CustomConfigService,
    private memberService: MemberService,
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
    this.verifyAuthHeader(req);

    try {
      const member = await this.verifyAppUserId(req);
      req.member = member;

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private verifyAuthHeader(req: Request): void {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    const authorizationKey =
      this.configService.get<string>('athorizationToken');

    if (type !== 'Bearer') {
      throw new AuthExceptions.InvalidAuthorizationTypeError();
    }
    if (token !== authorizationKey) {
      throw new AuthExceptions.InvalidAuthorizationTokenError();
    }
  }

  private async verifyAppUserId(req: Request): Promise<Member> {
    const appUserId = req.body.userRequest?.user?.properties?.appUserId ?? null;
    if (appUserId === null) {
      throw new AuthExceptions.AppUserIdNotExistError();
    }

    let member: Member | null = null;

    const isDevMode = this.configService.get<string>('mode');
    if (isDevMode) {
      const testAppUserId = this.configService.get<string>(
        'kakao.test.appUserId',
        { infer: true },
      )!;
      member = await this.memberService.findByAppUserId(testAppUserId);
    } else member = await this.memberService.findByAppUserId(appUserId);

    if (member === null) {
      throw new AuthExceptions.MemberNotFoundError();
    }

    return member;
  }
}
