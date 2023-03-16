import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InitTicketUseCase } from 'src/modules/ticket';
import { GetAllTicketCollectionsErrors } from 'src/modules/ticket/application/errors/get-all-ticket-collection.error';
import { GetTicketsByCategoryErrors } from 'src/modules/ticket/application/errors/get-ticket-collection-by-category.error';
import { IKakaoChatbotRequestDTO } from '../dtos/kakao-chatbot-request.dto.interface';
import { IKakaoChatbotResponseDTO } from '../dtos/kakao-chatbot-response.dto.interface';
import { TicketCategoryParamNotIncludedException } from '../exceptions/ticket-category-param-not-included.exception';
import { CarouselMapper } from '../infra/mappers/carousel.mapper';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { GetTicketCommerceCardsCarouselUseCase } from '../use-cases/get-ticket-commerce-cards-carousel/get-ticket-commerce-cards-carousel.use-case';
import { GetTicketListCarouselUseCase } from '../use-cases/get-ticket-list-carousel/get-ticket-list-carousel.use-case';

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
        case GetAllTicketCollectionsErrors.TicketNotFoundError:
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
        case GetTicketsByCategoryErrors.TicketNotFoundError:
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
