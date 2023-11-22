import { Injectable } from '@nestjs/common';
import { AppError, DomainError, IUseCase, Result, err } from 'src/core';
import { SimpleText } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/simple-text/simple-text.value-object';
import { CheckInOutService } from 'src/modules/my-page';

type UseCaseResult = Result<SimpleText, DomainError | AppError>;

@Injectable()
export class CheckOutUseCase implements IUseCase<never, UseCaseResult> {
  constructor(private checkInOutService: CheckInOutService) {}

  async execute(): Promise<UseCaseResult> {
    const checkOutOrError = await this.checkInOutService.checkOut();
    if (checkOutOrError.isErr()) return err(checkOutOrError.error);

    return SimpleText.create({
      value: `퇴실 완료되었습니다.`,
    });
  }
}
