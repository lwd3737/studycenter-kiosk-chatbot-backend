import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { err } from 'src/core';
import {
  GetTicketCollectionByCategoryUseCase,
  InitTicketUseCase,
  TicketNotFoundError,
} from 'src/modules/ticket';
import { IKakaoChatbotRequestDTO, IKakaoChatbotResponseDTO } from '../dtos';
import { ValidTicketCategoryNotIncludedException } from '../exceptions';
import { KaKaoChatbotResponseMapper, CarouselMapper } from '../infra/mappers';
import { GetTicketListCarouselUseCase } from '../use-cases';

@Controller('kakao-chatbot/ticket')
export class KakaoChatbotTicketController {
  constructor(
    private initTicketUseCase: InitTicketUseCase,
    private getTicketListCarouselUseCase: GetTicketListCarouselUseCase,
    private getTicketCollectionByCategoryUseCase: GetTicketCollectionByCategoryUseCase,
    private responseMapper: KaKaoChatbotResponseMapper,
    private carouselMapper: CarouselMapper,
  ) {}

  @Post('init')
  async init(): Promise<IKakaoChatbotResponseDTO> {
    const initResult = await this.initTicketUseCase.execute();
    if (initResult.isErr()) {
      const error = initResult.error;

      console.debug(error);

      throw new InternalServerErrorException(error.message);
    }

    return this.responseMapper.toDTO({
      outputs: [
        {
          simpleText: {
            text: '티켓이 초기화 되었습니다',
          },
        },
      ],
    });
  }

  @Post('collections')
  async getAllTicketCollections(): Promise<IKakaoChatbotResponseDTO> {
    const ticketListCarouselResult =
      await this.getTicketListCarouselUseCase.execute();
    if (ticketListCarouselResult.isErr()) {
      const error = ticketListCarouselResult.error;

      console.debug(error);

      switch (error.constructor) {
        case TicketNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message, {
            cause: error,
          });
      }
    }

    return this.responseMapper.toDTO({
      outputs: [
        {
          carousel: this.carouselMapper.toDTO(ticketListCarouselResult.value),
        },
      ],
    });
  }

  @Post('collection/by-category')
  async getTicketCollectionByCategory(
    @Body() request: IKakaoChatbotRequestDTO,
  ) {
    console.log(JSON.stringify(request, null, 2));
    // TODO: pipe로 request input validation
    const { action } = request;

    const TICKET_CATEGORIES = [
      'period_ticket',
      'hours_recharge_ticket',
      'same_day_ticket',
    ];

    const category = Object.keys(action.params).find((param) =>
      TICKET_CATEGORIES.includes(param),
    );

    if (!category) {
      throw new ValidTicketCategoryNotIncludedException(category);
    }

    const ticketsResult =
      await this.getTicketCollectionByCategoryUseCase.execute({
        category,
      });
    if (ticketsResult.isErr()) {
      const error = ticketsResult.error;

      switch (error.constructor) {
        case TicketNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message, {
            cause: error,
          });
      }
    }

    return ticketsResult.value;
  }
}
