import { BadRequestException, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';
import { Result, err, ok } from 'src/core';
import { ErrorDTOCreator } from '../dtos/error.dto';
import { KakaoChatbotResponseDTO } from '../dtos/IResponse.dto';

export type ParseClientExtraResult<T> = Result<T, KakaoChatbotResponseDTO>;

export class ParseClientExtraPipe<
  Required extends Record<string, any> = Record<string, any>,
> implements PipeTransform<KakaoChatbotRequestDTO, any>
{
  constructor(private required?: (keyof Required)[]) {}

  transform(
    value: KakaoChatbotRequestDTO,
  ): Result<Required, KakaoChatbotResponseDTO> {
    const clientExtra = value.action.clientExtra;
    if (!this.required) return ok(clientExtra as any);

    const nonExistentField = this.required.find(
      (field) => !(field in clientExtra),
    );
    if (nonExistentField) {
      console.debug(
        new BadRequestException(
          `${nonExistentField.toString()} not contained in clientExtra`,
        ),
      );
      return err(
        ErrorDTOCreator.toSimpleTextOutput(
          '잘못된 요청입니다. 다시 시도해주세요.',
        ),
      );
    }

    return ok(clientExtra as Required);
  }
}
