import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { IUseCase, Result, UnknownError, err, ok } from 'src/core';
import { DepositCallbackEventDTO } from '../../dtos/event.dto';
import { IPaymentRepo } from 'src/modules/payment/domain/payment/IPayment.repo';
import { EventApiService } from 'src/modules/kakao-chatbot';
import { OrderId } from 'src/modules/payment/domain/payment/base/order/order-id';
import {
  DepositCallbackError,
  DepositFailed,
  EventApiPublishFailed,
  GetResoucesError,
  GetTicketingContextError,
  MemberNotFoundError,
  PaymentNotFoundError,
  SeatNotFoundError,
  SeatNotSelectedError,
  SecretNotMatchError,
  TicketNotFoundError,
  TicketNotSelectedError,
} from './deposit-callback.error';
import { Member, MemberService } from 'src/modules/member';
import {
  TicketingContext,
  TicketingContextService,
} from 'src/modules/ticketing/application/services/ticketing-context.service';
import { SeatService } from 'src/modules/seat-management/services/seat.service';
import { EventApi } from 'src/modules/kakao-chatbot/domain/event-api/event-api.vo';
import { VirtualAccountPayment } from 'src/modules/payment/domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';
import { EventApiResponse } from 'src/modules/kakao-chatbot/domain/event-api/IEvent-api.repo';
import { MemberId } from 'src/modules/member/domain/member/member-id';
import {
  Ticket,
  TicketId,
  TicketService,
  TicketType,
} from 'src/modules/ticketing';
import { SeatId } from 'src/modules/seat-management/domain/seat/seat-id';
import { MyTicket } from 'src/modules/my-page/domain/my-ticket/my-ticket.ar';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { CheckInOutService, MyTicketService } from 'src/modules/my-page';

type UseCaseInput = {
  event: DepositCallbackEventDTO;
};
type UseCaseResult = Result<true, DepositCallbackError>;

@Injectable()
export class DepositCallbackUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(
    private paymentRepo: IPaymentRepo,
    @Inject(forwardRef(() => EventApiService))
    private eventApiService: EventApiService,
    private ticketingContextService: TicketingContextService,
    private memberService: MemberService,
    private ticketService: TicketService,
    private seatService: SeatService,
    private myTicketService: MyTicketService,
    private checkInOutService: CheckInOutService,
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    if (input.event.status !== 'DONE') return err(new DepositFailed());

    try {
      const resourcesOrError = await this.getResources(input.event);
      if (resourcesOrError.isErr()) return err(resourcesOrError.error);
      const { payment, member, ticket, seatInfo } = resourcesOrError.value;

      const myTicketOrError = MyTicket.new({
        paymentId: payment.paymentId.value,
        memberId: member.memberId.value,
        ticketId: ticket.ticketId.value,
        type: ticket.type as TicketType,
        title: `[${ticket.typeDisplay}]${ticket.title}`,
        totalUsageDuration: {
          unit: ticket.usageDuration.unit,
          value: ticket.usageDuration.value,
        },
      });
      if (myTicketOrError.isErr()) return err(myTicketOrError.error);
      const myTicket = myTicketOrError.value;

      await this.myTicketService.create(myTicket);

      // TODO: 주석 제거
      // const checkInOrError = await this.checkInOutService.checkIn(
      //   myTicket,
      //   member,
      // );
      // if (checkInOrError.isErr()) return err(checkInOrError.error);

      await this.myTicketService.update(myTicket);

      const resOrError = await this.sendMessage({ member, ticket, seatInfo });
      if (resOrError.isErr()) return err(resOrError.error);

      return ok(true);
    } catch (error) {
      return err(new UnknownError(error));
    }
  }

  private async getResources(event: DepositCallbackEventDTO): Promise<
    Result<
      {
        payment: VirtualAccountPayment;
        member: Member;
        ticket: Ticket;
        seatInfo: { room: Room; seat: Seat };
      },
      GetResoucesError
    >
  > {
    const paymetOrError = await this.getVirtualAccountPayment(event);
    if (paymetOrError.isErr()) return err(paymetOrError.error);

    const memberOrError = await this.getMember(paymetOrError.value.memberId);
    if (memberOrError.isErr()) return err(memberOrError.error);
    const member = memberOrError.value;

    const ticketingContextOrError = await this.getTicketingContext(member);
    if (ticketingContextOrError.isErr())
      return err(ticketingContextOrError.error);
    const ticketingContext = ticketingContextOrError.value;

    const ticketOrError = await this.getTicket(
      new TicketId(ticketingContext.ticketId),
    );
    if (ticketOrError.isErr()) return err(ticketOrError.error);

    const seatInfoOrError = await this.getSeatInfo(
      new SeatId(ticketingContext.seatId),
    );
    if (seatInfoOrError.isErr()) return err(seatInfoOrError.error);

    return ok({
      payment: paymetOrError.value,
      member,
      ticket: ticketOrError.value,
      seatInfo: seatInfoOrError.value,
    });
  }

  private async getVirtualAccountPayment(event: DepositCallbackEventDTO) {
    const found = await this.paymentRepo.findByOrderId(
      new OrderId(event.orderId),
    );
    if (!found) return err(new PaymentNotFoundError(event.orderId));

    if (found.secret !== event.secret) return err(new SecretNotMatchError());
    return ok(found);
  }

  private async getMember(
    memberId: MemberId,
  ): Promise<Result<Member, MemberNotFoundError>> {
    const found = await this.memberService.findById(memberId.value);
    if (found === null) return err(new MemberNotFoundError(memberId.value));
    return ok(found);
  }

  private async getTicketingContext(
    member: Member,
  ): Promise<Result<TicketingContext, GetTicketingContextError>> {
    const { ticketId, seatId } =
      this.ticketingContextService.get(member.appUserId) ?? {};

    if (!ticketId) {
      const resOrError = await this.publishEventApi(
        member,
        '이용권이 선택되지 않았습니다. [입실하기]를 선택해서 이용권을 선택해주세요.',
      );
      if (resOrError.isErr()) return err(resOrError.error);

      return err(new TicketNotSelectedError());
    }
    if (!seatId) {
      const resOrError = await this.publishEventApi(
        member,
        '좌석이 선택되지 않았습니다. [입실하기]를 선택해서 좌석을 선택해주세요.',
      );
      if (resOrError.isErr()) return err(resOrError.error);

      return err(new SeatNotSelectedError());
    }

    return ok({ ticketId, seatId });
  }

  private async getTicket(
    ticketId: TicketId,
  ): Promise<Result<Ticket, TicketNotFoundError>> {
    const found = await this.ticketService.findOneById(ticketId);
    if (!found) return err(new TicketNotFoundError(ticketId.value));
    return ok(found);
  }

  private async getSeatInfo(
    seatId: SeatId,
  ): Promise<Result<{ room: Room; seat: Seat }, SeatNotFoundError>> {
    const found = await this.seatService.findSeatInfoById(seatId);
    if (!found) return err(new SeatNotFoundError(seatId.value));
    return ok(found);
  }

  private async sendMessage(info: {
    member: Member;
    ticket: Ticket;
    seatInfo: { room: Room; seat: Seat };
  }): Promise<Result<EventApiResponse, EventApiPublishFailed>> {
    return await this.publishEventApi(
      info.member,
      this.createMessage(info.ticket, info.seatInfo),
    );
  }

  private createMessage(
    ticket: Ticket,
    seatInfo: { room: Room; seat: Seat },
  ): string {
    return `입금이 완료되었습니다.\n입실하기로 처리되어 [${ticket.title}] 사용을 시작합니다.\n지금부터 [${seatInfo.room.number.value}]열람실 [${seatInfo.seat.number.value}]번 좌석을 이용하실 수 있습니다.`;
  }

  private async publishEventApi(
    member: Member,
    message: string,
  ): Promise<Result<EventApiResponse, EventApiPublishFailed>> {
    const eventApiArgs: EventApi = {
      event: {
        name: 'depositCallback',
        data: {
          message,
        },
      },
      user: {
        type: 'appUserId',
        id: member.appUserId,
      },
    };

    const res = await this.eventApiService.publish(eventApiArgs);
    if (res.status !== 'SUCCESS')
      return err(new EventApiPublishFailed(res.message));

    return ok(res);
  }
}
