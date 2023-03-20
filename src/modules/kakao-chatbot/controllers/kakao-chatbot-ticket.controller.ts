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
import { TicketCategoryEnum } from 'src/modules/ticket/domain/ticket-category.value-object';
import { KakaoChatbotResponseDTO } from '../dtos/kakao-chatbot-response.dto.interface';
import { CarouselMapper } from '../infra/mappers/carousel.mapper';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { ParseTicketCategoryParamPipe } from '../pipes/parse-ticket-category-param.pipe';
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
  async init(): Promise<KakaoChatbotResponseDTO> {
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

  @Post('all-collections')
  async getAllTicketCollections(): Promise<KakaoChatbotResponseDTO> {
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
    @Body(ParseTicketCategoryParamPipe) ticketCategory: TicketCategoryEnum,
  ): Promise<KakaoChatbotResponseDTO> {
    const ticketCommerceCardsCarouselResult =
      await this.getTicketCommerceCardsCarouselUseCase.execute({
        category: ticketCategory,
      });

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

  // @Post('select')
  // async selectTicket() {}
}
