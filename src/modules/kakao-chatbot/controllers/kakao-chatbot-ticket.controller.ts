import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  GetAllTicketCollectionsErrors,
  GetTicketByTimeErrors,
  GetTicketsByCategoryErrors,
  GetTicketsByCategoryUseCase,
  InitTicketUseCase,
} from 'src/modules/ticketing';
import { GetTicketByTimeUseCase } from 'src/modules/ticketing/application/use-cases/get-ticket-by-time.use-case';
import { TicketCategoryEnum } from 'src/modules/ticketing/domain/ticket/ticket-category.value-object';
import { TicketTime } from '../domain/ticket-time/ticket-time.value-object';
import { KakaoChatbotResponseDTO } from '../dtos/kakao-chatbot-response.dto.interface';
import { CarouselMapper } from '../infra/mappers/carousel.mapper';
import { ContextControlMapper } from '../infra/mappers/context-control.mapper';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { SimpleTextMapper } from '../infra/mappers/simple-text.mapper';
import { ParseTicketCategoryParamPipe } from '../pipes/parse-ticket-category-param.pipe';
import { ParseTicketTimeParamPipe } from '../pipes/parse-ticket-time-param.pipe';
import { SelectTicketSimpleTextUseCase } from '../use-cases/select-ticket-simple-text.use-case.ts/select-ticket-simple-text.use-case';
import { GetTicketCommerceCardsCarouselUseCase } from '../use-cases/get-ticket-commerce-cards-carousel/get-ticket-commerce-cards-carousel.use-case';
import { GetTicketListCarouselUseCase } from '../use-cases/get-ticket-list-carousel/get-ticket-list-carousel.use-case';

@Controller('kakao-chatbot/tickets')
export class KakaoChatbotTicketController {
  constructor(
    private initTicketUseCase: InitTicketUseCase,
    private getTicketListCarouselUseCase: GetTicketListCarouselUseCase,
    private getTicketByTimeUseCase: GetTicketByTimeUseCase,
    private getTicketsByCategoryUseCase: GetTicketsByCategoryUseCase,
    private getTicketCommerceCardsCarouselUseCase: GetTicketCommerceCardsCarouselUseCase,
    private selectTicketSimpleTextUseCase: SelectTicketSimpleTextUseCase,
    private responseMapper: KaKaoChatbotResponseMapper,
    private carouselMapper: CarouselMapper,
    private simpleTextMapper: SimpleTextMapper,
    private contextControlMapper: ContextControlMapper,
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
            text: '이용권이 초기화 되었습니다',
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
    // TODO: raw data로 바꾸기
    @Body(ParseTicketCategoryParamPipe) ticketCategory: TicketCategoryEnum,
  ): Promise<KakaoChatbotResponseDTO> {
    const ticketsByCategoryResult =
      await this.getTicketsByCategoryUseCase.execute({
        category: ticketCategory,
      });
    if (ticketsByCategoryResult.isErr()) {
      const error = ticketsByCategoryResult.error;
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

    const ticketCommerceCardsCarouselResult =
      await this.getTicketCommerceCardsCarouselUseCase.execute({
        tickets: ticketsByCategoryResult.value,
      });

    if (ticketCommerceCardsCarouselResult.isErr()) {
      const error = ticketCommerceCardsCarouselResult.error;
      console.debug(error);

      switch (error.constructor) {
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

  @Post('select')
  async selectTicket(
    @Body(ParseTicketTimeParamPipe) ticketTime: TicketTime,
  ): Promise<KakaoChatbotResponseDTO> {
    const ticketResult = await this.getTicketByTimeUseCase.execute({
      ticketTime,
    });
    if (ticketResult.isErr()) {
      const error = ticketResult.error;
      console.debug(error);

      switch (error.constructor) {
        case GetTicketByTimeErrors.TicketNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message);
      }
    }

    const selectResult = await this.selectTicketSimpleTextUseCase.execute({
      ticket: ticketResult.value,
    });

    if (selectResult.isErr()) {
      const error = selectResult.error;
      console.debug(error);

      switch (error.constructor) {
        default:
          throw new InternalServerErrorException(error.message);
      }
    }

    const { simpleText, contextControl } = selectResult.value;

    return this.responseMapper.toDTO({
      outputs: [
        {
          simpleText: this.simpleTextMapper.toDTO(simpleText),
        },
      ],
      context: this.contextControlMapper.toDTO(contextControl),
    });
  }
}
