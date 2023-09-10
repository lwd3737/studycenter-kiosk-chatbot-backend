import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { IUseCase, Result, UnknownError, err, ok } from 'src/core';
import { DepositCallbackEventDTO } from '../../dtos/event.dto';
import {
  IPaymentRepo,
  PaymentRepoProvider,
} from 'src/modules/payment/domain/payment/IPayment.repo';
import { EventApiService } from 'src/modules/kakao-chatbot';
import { OrderId } from 'src/modules/payment/domain/payment/base/order/order-id';
import {
  DepositCallbackError,
  DepositFailed,
  EventApiPublishFailed,
  MemberNotFoundError,
  PaymentNotFoundError,
} from './deposit-callback.error';
import { MemberService } from 'src/modules/member';

type UseCaseInput = {
  event: DepositCallbackEventDTO;
};
type UseCaseResult = Result<true, DepositCallbackError>;

@Injectable()
export class DepositCallbackUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(
    @Inject(forwardRef(() => EventApiService))
    private eventApiService: EventApiService,
    @Inject(PaymentRepoProvider) private paymentRepo: IPaymentRepo,
    private memberService: MemberService,
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    if (input.event.status !== 'DONE') return err(new DepositFailed());

    try {
      const foundPayment = await this.paymentRepo.findByOrderId(
        new OrderId(input.event.orderId),
      );
      if (!foundPayment)
        return err(new PaymentNotFoundError(input.event.orderId));

      const foundMember = await this.memberService.findById(
        foundPayment.memberId.value,
      );
      if (foundMember === null)
        return err(new MemberNotFoundError(foundPayment.memberId.value));

      const resOrError = await this.eventApiService.publish({
        event: {
          name: 'depositCallback',
          data: {
            message: '입금이 완료되었습니다',
          },
        },
        user: {
          type: 'appUserId',
          id: foundMember.appUserId,
        },
      });
      if (resOrError.status !== 'SUCCESS')
        return err(new EventApiPublishFailed(resOrError.message));

      return ok(true);
    } catch (error) {
      return err(new UnknownError(error));
    }
  }
}
