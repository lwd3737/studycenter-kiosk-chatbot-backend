import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';

export type SyncOtp = {
  otp: string;
  app_user_id: string;
};

@Injectable()
export class ParseSyncOtpParamPipe
  implements PipeTransform<KakaoChatbotRequestDTO, SyncOtp>
{
  transform(value: KakaoChatbotRequestDTO) {
    const syncJson = value.action.params['sync'];
    if (!syncJson) {
      const message = `sync param is not included`;
      console.error(message);

      throw new BadRequestException(message);
    }

    const sync = JSON.parse(syncJson) as SyncOtp;
    if (!('otp' in sync) || !('app_user_id' in sync)) {
      const message = `otp and app_user_id is included`;
      console.error(message);

      throw new BadRequestException(message);
    }

    return sync;
  }
}
