import { BadRequestException, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';

export class New__ParseClientExtraPipe<R>
  implements PipeTransform<KakaoChatbotRequestDTO>
{
  constructor(private required: (keyof R)[]) {}

  transform(value: KakaoChatbotRequestDTO): R {
    const clientExtra = value.action.clientExtra;
    if (!this.required) return clientExtra as R;

    const nonExistentField = this.required.find(
      (field) => !(field in clientExtra),
    );
    if (nonExistentField) {
      console.debug(
        new BadRequestException(
          `${nonExistentField.toString()} not contained in clientExtra`,
        ),
      );
    }

    return clientExtra as R;
  }
}
