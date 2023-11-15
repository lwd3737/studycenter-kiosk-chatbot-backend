import { Body, Controller, Post } from '@nestjs/common';
import { GetAvailableMyTicketsUseCase } from '../application/usecases/check-in-out/get-available-my-tickets/get-available-my-tickets.usecase';
import { ParseAppUserIdParamPipe } from '../application/pipes/parse-app-user-id-param.pipe';
import { DomainError, UnknownError } from 'src/core';
import { AlreadyInUseMyTicketError } from '../application/usecases/check-in-out/get-available-my-tickets/get-available.my-tickets.error';
import { ErrorDTOCreator } from '../application/dtos/error.dto';
import { KAKAO_CHATBOT_PREFIX } from './controller-prefix';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { ItemCardCarouselMapper } from '../infra/mappers/item-card-carousel.mapper';
import { New__ParseClientExtraPipe } from '../application/pipes/new-parse-client-extra.pipe';
import { GetAllRoomsUseCase } from '../application/usecases/check-in-out/get-all-rooms/get-all-rooms.usecase';
import { GetAvailableSeatsInRoomUseCase } from '../application/usecases/check-in-out/get-available-seats-in-room/get-available-seats-in-room.usecase';
import { ListCardCarouselMapper } from '../infra/mappers/list-card-carousel.mapper';
import { ParseContextParamsPipe } from '../application/pipes/parse-context-params.pipe';
import { ContextControlDTO } from '../application/dtos/IResponse.dto';
import { CheckInUseCase } from '../application/usecases/check-in-out/check-in/usecase';
import { SimpleTextMapper } from '../infra/mappers/simple-text.mapper';

const CHECK_IN_PREFIX = 'check-in';

@Controller(`${KAKAO_CHATBOT_PREFIX}`)
export class KakaoChatbotCheckInOutController {
  constructor(
    private getAvailableMyTicketsUseCase: GetAvailableMyTicketsUseCase,
    private getAllRoomsUseCase: GetAllRoomsUseCase,
    private getAvailableSeatsInRoomUseCase: GetAvailableSeatsInRoomUseCase,
    private checkInUseCase: CheckInUseCase,
  ) {}

  @Post('available-my-tickets')
  async getAvailableMyTickets(
    @Body(ParseAppUserIdParamPipe) appUserId: string,
  ) {
    const carouselOrError = await this.getAvailableMyTicketsUseCase.execute({
      appUserId,
    });
    if (carouselOrError.isErr()) {
      console.debug(carouselOrError.error);

      switch (carouselOrError.error.constructor) {
        case AlreadyInUseMyTicketError:
          return ErrorDTOCreator.toSimpleTextOutput(
            '이미 사용중인 이용권이 있습니다',
          );
        case DomainError:
        case UnknownError:
        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            '이용권 조회에 실패했습니다. 다시 시도해주세요',
          );
      }
    }

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        {
          carousel: ItemCardCarouselMapper.toDTO(carouselOrError.value),
        },
      ],
    });
  }

  @Post(`${CHECK_IN_PREFIX}/all-rooms`)
  async getAllRomms(
    @Body(new New__ParseClientExtraPipe(['myTicketId']))
    clientExtra: {
      myTicketId: string;
    },
  ) {
    const itemCardCarouselOrError = await this.getAllRoomsUseCase.execute();
    if (itemCardCarouselOrError.isErr()) {
      const error = itemCardCarouselOrError.error;
      console.debug(error);

      return ErrorDTOCreator.toSimpleTextOutput(
        '전체 방 조회 중에 오류가 발생했어요!',
      );
    }

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        {
          carousel: ItemCardCarouselMapper.toDTO(itemCardCarouselOrError.value),
        },
      ],
      context: this.createCheckInContext(clientExtra.myTicketId),
    });
  }

  @Post(`${CHECK_IN_PREFIX}/room/available-seats`)
  async getAvailableSeatsInRoom(
    @Body(new New__ParseClientExtraPipe(['roomId']))
    clientExtra: {
      roomId: string;
    },
    @Body(new ParseContextParamsPipe('check-in'))
    context: { myTicketId: string },
  ) {
    const listCardCarouselsOrError =
      await this.getAvailableSeatsInRoomUseCase.execute({
        roomId: clientExtra.roomId,
      });
    if (listCardCarouselsOrError.isErr()) {
      const error = listCardCarouselsOrError.error;
      console.debug(error);

      switch (error.constructor) {
        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            '좌석을 불러오는데 실패했어요.',
          );
      }
    }
    const listCardCarousels = listCardCarouselsOrError.value;

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        ...listCardCarousels.map((carousel) => ({
          carousel: ListCardCarouselMapper.toDTO(carousel),
        })),
      ],
      context: this.createCheckInContext(context.myTicketId),
    });
  }

  @Post(CHECK_IN_PREFIX)
  async checkIn(
    @Body(ParseAppUserIdParamPipe) appUserId: string,
    @Body(new New__ParseClientExtraPipe(['seatId']))
    clientExtra: { seatId: string },
    @Body(new ParseContextParamsPipe('check-in'))
    context: { myTicketId: string },
  ) {
    const simpleTextOrError = await this.checkInUseCase.execute({
      appUserId,
      seatId: clientExtra.seatId,
      myTicketId: context.myTicketId,
    });
    if (simpleTextOrError.isErr()) {
      const error = simpleTextOrError.error;
      console.debug(error);

      switch (error.constructor) {
        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            '입실 중에 오류가 발생했어요. 다시 시도해주세요.',
          );
      }
    }

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        {
          simpleText: SimpleTextMapper.toDTO(simpleTextOrError.value),
        },
      ],
    });
  }

  private createCheckInContext(myTicketId: string): ContextControlDTO {
    return {
      values: [
        {
          name: 'check-in',
          lifeSpan: 3,
          params: {
            myTicketId,
          },
        },
      ],
    };
  }
}
