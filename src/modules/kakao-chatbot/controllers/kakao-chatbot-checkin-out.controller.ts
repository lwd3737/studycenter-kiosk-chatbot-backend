import { Body, Controller, Post } from '@nestjs/common';
import { GetAvailableMyTicketsUseCase } from '../application/usecases/check-in-out/get-available-my-tickets/get-available-my-tickets.usecase';
import { ParseAppUserIdParamPipe } from '../application/pipes/parse-app-user-id-param.pipe';
import { DomainError, UnknownError } from 'src/core';
import { AlreadyInUseMyTicketError } from '../application/usecases/check-in-out/get-available-my-tickets/get-available.my-tickets.error';
import { ErrorDTOCreator } from '../application/dtos/error.dto';
import { KAKAO_CHATBOT_PREFIX } from './controller-prefix';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { ItemCardCarouselMapper } from '../infra/mappers/item-card-carousel.mapper';

@Controller(`${KAKAO_CHATBOT_PREFIX}`)
export class KakaoChatbotCheckInOutController {
  constructor(
    private getAvailableMyTicketsUseCase: GetAvailableMyTicketsUseCase,
  ) {}

  @Post('available-my-tickets')
  async getAvailableMyTickets(
    @Body(new ParseAppUserIdParamPipe()) appUserId: string,
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

  @Post('check-in')
  async checkIn() {}
}
