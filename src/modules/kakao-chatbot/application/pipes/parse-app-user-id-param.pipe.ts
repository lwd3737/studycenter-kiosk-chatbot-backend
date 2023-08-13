import { PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';

export class ParseAppUserIdParamPipe
  implements PipeTransform<KakaoChatbotRequestDTO, string>
{
  transform(value: KakaoChatbotRequestDTO): string {
    return value.userRequest.user.properties.appUserId;
  }
}
