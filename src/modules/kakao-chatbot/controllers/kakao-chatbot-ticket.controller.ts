import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  GetAllTicketCollectionsErrors,
  GetTicketsByCategoryErrors,
  GetTicketsByCategoryUseCase,
  InitTicketsUseCase,
} from 'src/modules/ticketing';
import { TicketCategoryEnum } from 'src/modules/ticketing/domain/ticket/ticket-category.value-object';
import { KakaoChatbotResponseDTO } from '../dtos/response.dto.interface';
import { CarouselMapper } from '../infra/mappers/carousel.mapper';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { ParseTicketCategoryParamPipe } from '../pipes/parse-ticket-category-param.pipe';
import { GetTicketCommerceCardsCarouselUseCase } from '../use-cases/get-ticket-commerce-cards-carousel/get-ticket-commerce-cards-carousel.use-case';
import { GetTicketListCarouselUseCase } from '../use-cases/get-ticket-list-carousel/get-ticket-list-carousel.use-case';
import { ErrorDTOCreator } from '../dtos/error.dto';
import { TicketTemplateDTOCreator } from '../dtos/ticket-template.dto';

@Controller('kakao-chatbot/tickets')
export class KakaoChatbotTicketController {
  constructor(
    private initTicketUseCase: InitTicketsUseCase,
    private getTicketListCarouselUseCase: GetTicketListCarouselUseCase,
    private getTicketsByCategoryUseCase: GetTicketsByCategoryUseCase,
    private getTicketCommerceCardsCarouselUseCase: GetTicketCommerceCardsCarouselUseCase,
    private responseMapper: KaKaoChatbotResponseMapper,
    private carouselMapper: CarouselMapper,
  ) {}

  @Post('init')
  async init(): Promise<KakaoChatbotResponseDTO> {
    const initOrError = await this.initTicketUseCase.execute();
    if (initOrError.isErr()) {
      const error = initOrError.error;

      console.debug(error);

      return ErrorDTOCreator.toSimpleTextOutput(
        '이용권 초기화에 실패했습니다. 다시 시도해주세요!',
      );
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
        case GetAllTicketCollectionsErrors.TicketNotExistError:
          return ErrorDTOCreator.toSimpleTextOutput(
            '이용권이 존재하지 않아요. 상담연결 해주세요!',
          );
        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            '이용권을 불러오는데 실패했습니다. 다시 시도해주세요!',
          );
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
    @Body(ParseTicketCategoryParamPipe) ticketCategory: string,
  ): Promise<KakaoChatbotResponseDTO> {
    const ticketsByCategoryOrError =
      await this.getTicketsByCategoryUseCase.execute({
        category: ticketCategory,
      });
    if (ticketsByCategoryOrError.isErr()) {
      const error = ticketsByCategoryOrError.error;
      console.debug(error);

      switch (error.constructor) {
        case GetTicketsByCategoryErrors.TicketNotFoundError:
          return ErrorDTOCreator.toSimpleTextOutput(
            `${ticketCategory} 이용권은 존재하지 않는 이용권이에요. 아래 이용권 중에 선택해주세요!`,
            TicketTemplateDTOCreator.toTicketCategoriesQuickReplies(),
          );
        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            '이용권 목록을 불러오는데 실패했어요. 다시 시도해주세요!',
          );
      }
    }

    const ticketCommerceCardsCarouselOrError =
      await this.getTicketCommerceCardsCarouselUseCase.execute({
        tickets: ticketsByCategoryOrError.value,
      });

    if (ticketCommerceCardsCarouselOrError.isErr()) {
      const error = ticketCommerceCardsCarouselOrError.error;
      console.debug(error);

      switch (error.constructor) {
        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            '이용권 목록을 출력하는데 실패했어요. 다시 시도해주세요!',
          );
      }
    }

    return this.responseMapper.toDTO({
      outputs: [
        {
          carousel: this.carouselMapper.toDTO(
            ticketCommerceCardsCarouselOrError.value,
          ),
        },
      ],
    });
  }
}
