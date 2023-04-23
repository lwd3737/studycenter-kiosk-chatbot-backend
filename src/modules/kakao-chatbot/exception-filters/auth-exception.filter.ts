import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorDTOCreator } from '../utils/error-dto-handling';
import { AuthExceptions } from 'src/modules/auth/auth-exceptions';

@Catch(UnauthorizedException)
export class AuthExceptionFilter
  implements ExceptionFilter<UnauthorizedException>
{
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(
    exception: UnauthorizedException,
    host: ArgumentsHost,
  ): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    switch (exception.constructor) {
      case AuthExceptions.InvalidAuthorizationTypeError:
      case AuthExceptions.InvalidAuthorizationTokenError:
      case AuthExceptions.AppUserIdNotExistError: {
        httpAdapter.reply(
          ctx.getResponse(),
          ErrorDTOCreator.toSimpleTextOutput(
            '인증에 실패했어요! 아래 메뉴를 통해 상담연결 하실 수 있어요',
          ),
        );
        break;
      }
      case AuthExceptions.MemberNotFoundError: {
        httpAdapter.reply(
          ctx.getResponse(),
          ErrorDTOCreator.toSimpleTextOutput('회원가입이 필요해요!', [
            {
              label: '회원가입',
              action: 'block',
              messageText: '회원가입 진행하기',
              blockId: process.env.SIGNUP_BLOCK_ID,
            },
          ]),
        );
        break;
      }
    }
  }
}
