import { Body, Controller, Post } from '@nestjs/common';
import { KakaoChatbotResponseDTO } from '../dtos/response.dto.interface';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import {
  ParseSyncOtpParamPipe,
  SyncOtp,
} from '../pipes/parse-sync-otp-param.pipe';
import { UseAuthBlockErrors } from '../use-cases/use-auth-block/use-auth-block.error';
import { UseAuthBlockUseCase } from '../use-cases/use-auth-block/use-auth-block.use-case';
import { ErrorDTOCreator } from '../dtos/error.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { SignupUseCase } from 'src/modules/auth';

@Controller('kakao-chatbot/auth')
export class KakaoChatbotAuthController {
  constructor(
    private useAuthBlockUseCase: UseAuthBlockUseCase,
    private signupUseCase: SignupUseCase,

    private responseMapper: KaKaoChatbotResponseMapper,
  ) {}

  @Post('signup')
  @Public()
  public async signup(
    @Body(ParseSyncOtpParamPipe) syncOtp: SyncOtp,
  ): Promise<KakaoChatbotResponseDTO> {
    const authBlockResult = await this.useAuthBlockUseCase.execute(syncOtp);

    if (authBlockResult.isErr()) {
      const error = authBlockResult.error;
      switch (error.constructor) {
        case UseAuthBlockErrors.AlreadyAuthenticatedError:
          return ErrorDTOCreator.toSimpleTextOutput(
            '이미 회원가입 되어 있습니다. 아래 메뉴를 통해 서비스를 이용하실 수 있어요!',
          );

        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            '회원가입에 실패했어요! 아래 메뉴를 통해 상담연결 하실 수 있어요',
          );
      }
    }

    return this.responseMapper.toDTO({
      outputs: [
        {
          simpleText: {
            text: '회원가입 되었습니다. 이제 아래 메뉴를 통해 서비스를 이용하실 수 있어요!',
          },
        },
      ],
    });
  }
}
