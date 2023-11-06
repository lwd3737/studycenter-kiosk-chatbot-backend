import { Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';
import { CustomConfigService } from 'src/modules/config';

@Injectable()
export class ParseAppUserIdParamPipe
  implements PipeTransform<KakaoChatbotRequestDTO, string>
{
  constructor(private configService: CustomConfigService) {}

  transform(value: KakaoChatbotRequestDTO): string {
    const devMode = this.configService.get('devMode', { infer: true })!;
    const testAppUserId = this.configService.get('kakao.test.appUserId', {
      infer: true,
    })!;
    return devMode
      ? testAppUserId
      : value.userRequest.user.properties.appUserId;
  }
}
