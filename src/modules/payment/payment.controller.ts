import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { DepositCallbackEventDTO } from './application/dtos/event.dto';
import { DepositCallbackUseCase } from './application/usecases/deposit-callback/deposit-callback.usecase';

// TODO: public 제거
@Public()
@Controller('payment')
export class PaymentController {
  constructor(private depositCallbackUseCase: DepositCallbackUseCase) {}

  @Post('virtual-account/deposit-callback')
  async depositCallback(@Body() event: DepositCallbackEventDTO) {
    const okOrError = await this.depositCallbackUseCase.execute({ event });
    if (okOrError.isErr()) {
      const error = okOrError.error;
      console.debug(error);

      return {
        error: error.message,
      };
    }

    return {
      message: 'ok',
    };
  }
}
