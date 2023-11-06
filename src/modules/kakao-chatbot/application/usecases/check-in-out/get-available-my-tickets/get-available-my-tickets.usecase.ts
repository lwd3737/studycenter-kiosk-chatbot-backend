import { Injectable } from '@nestjs/common';
import { IUseCase, Result, UnknownError, err, ok } from 'src/core';
import { MyTicketInfoItemCardCarousel } from 'src/modules/kakao-chatbot/domain/my-ticket-info-item-card-carousel/my-ticket-info-item-card-carousel.vo';
import { MyTicketService } from 'src/modules/my-page';
import {
  AlreadyInUseMyTicketError,
  GetAvailableMyTicketsError,
} from './get-available.my-tickets.error';
import { FixedExpiryUsageDuration } from 'src/modules/my-page/domain/my-ticket/usage-duration/fixed-expiry-usage-duration.vo';

type GetAvailableMyTicketsUseCaseInput = {
  appUserId: string;
};
type GetAvailableMyTicketsUseCaseResult = Result<
  MyTicketInfoItemCardCarousel,
  GetAvailableMyTicketsError
>;

@Injectable()
export class GetAvailableMyTicketsUseCase
  implements
    IUseCase<
      GetAvailableMyTicketsUseCaseInput,
      GetAvailableMyTicketsUseCaseResult
    >
{
  constructor(private myTicketService: MyTicketService) {}

  async execute(
    input: GetAvailableMyTicketsUseCaseInput,
  ): Promise<Result<MyTicketInfoItemCardCarousel, GetAvailableMyTicketsError>> {
    try {
      const myTickets = await this.myTicketService.findByAppUserId(
        input.appUserId,
      );
      const availableMyTickets = myTickets.filter(
        (myTicket) => myTicket.usageDuration.isExpired === false,
      );
      const myTicketInUse = availableMyTickets.find(
        (myTicket) => myTicket.inUse,
      );
      if (myTicketInUse) return err(new AlreadyInUseMyTicketError());

      const carouselOrError = MyTicketInfoItemCardCarousel.new({
        myTickets: availableMyTickets.map((myTicket) => ({
          id: myTicket.id.value,
          title: myTicket.title,
          totalUsageDuration: myTicket.usageDuration.totalDuration,
          inUse: myTicket.inUse,
          remainingTime: myTicket.usageDuration.remainingTime,
          endAt:
            myTicket.usageDuration instanceof FixedExpiryUsageDuration
              ? myTicket.usageDuration.endAt
              : undefined,
        })),
      });
      if (carouselOrError.isErr()) return err(carouselOrError.error);

      return ok(carouselOrError.value);
    } catch (error) {
      return err(new UnknownError(error));
    }
  }
}
