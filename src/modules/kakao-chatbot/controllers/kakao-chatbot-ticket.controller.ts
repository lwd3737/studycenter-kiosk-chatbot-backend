import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { err } from 'src/core';
import { InitTicketUseCase, TicketNotFoundError } from 'src/modules/ticket';
import { IKakaoChatbotRequestDTO, IKakaoChatbotResponseDTO } from '../dtos';
import { TicketCategoryParamNotIncludedException } from '../exceptions';
import { KaKaoChatbotResponseMapper, CarouselMapper } from '../infra/mappers';
import {
  GetTicketCommerceCardsCarouselUseCase,
  GetTicketListCarouselUseCase,
} from '../use-cases';

@Controller('kakao-chatbot/tickets')
export class KakaoChatbotTicketController {
  constructor(
    private initTicketUseCase: InitTicketUseCase,
    private getTicketListCarouselUseCase: GetTicketListCarouselUseCase,
    private getTicketCommerceCardsCarouselUseCase: GetTicketCommerceCardsCarouselUseCase,
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

  @Post('by-category')
  async getTicketsByCategory(
    @Body() request: IKakaoChatbotRequestDTO,
  ): Promise<IKakaoChatbotResponseDTO> {
    // TODO: pipe로 request input validation -> transform
    const { params } = request.action;
    const param = Object.keys(params)[0];

    const TICKET_CATEGORIES = [
      'period_ticket',
      'hours_recharge_ticket',
      'same_day_ticket',
    ] as const;

    const indexFound = TICKET_CATEGORIES.findIndex(
      (category) => category === param,
    );
    if (indexFound < 0) {
      throw new TicketCategoryParamNotIncludedException();
    }

    const category = TICKET_CATEGORIES[indexFound];

    const ticketCommerceCardsCarouselResult =
      await this.getTicketCommerceCardsCarouselUseCase.execute({ category });
    if (ticketCommerceCardsCarouselResult.isErr()) {
      const error = ticketCommerceCardsCarouselResult.error;

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
          carousel: this.carouselMapper.toDTO(
            ticketCommerceCardsCarouselResult.value,
          ),
        },
      ],
    });
  }
}
