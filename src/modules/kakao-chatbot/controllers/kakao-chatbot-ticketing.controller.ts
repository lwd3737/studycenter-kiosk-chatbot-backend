import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  GetAllTicketCollectionsErrors,
  GetTicketsByCategoryErrors,
  GetTicketsByCategoryUseCase,
  InitTicketsUseCase,
} from 'src/modules/ticketing';
import { KakaoChatbotResponseDTO } from '../dtos/response.dto.interface';
import { CarouselMapper } from '../infra/mappers/carousel.mapper';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { ParseTicketCategoryParamPipe } from '../pipes/parse-ticket-category-param.pipe';
import { GetTicketCommerceCardsCarouselUseCase } from '../use-cases/get-ticket-commerce-cards-carousel/get-ticket-commerce-cards-carousel.use-case';
import { GetTicketListCarouselUseCase } from '../use-cases/get-ticket-list-carousel/get-ticket-list-carousel.use-case';
import { ErrorDTOCreator } from '../dtos/error.dto';
import { TicketTemplateDTOCreator } from '../dtos/ticket-template.dto';
import { KAKAO_CHATBOT_PREFIX } from './controller-prefix';
import { ParseTicketIdFromClientExtraPipe } from '../pipes/parse-ticket-id-from-client-extra.pipe';
import { GetSeatCollectionsByRoomUseCase } from 'src/modules/seat-management';
import { GetRoomItemCardsCarouselUseCase } from '../use-cases/get-room-item-cards-carousel/get-room-item-cards-carousel.use-case';
import { ContextControlMapper } from '../infra/mappers/context-control.mapper';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { ContextControl } from '../domain/base/context-control/context-control.value-object';
import { ContextValue } from '../domain/base/context-control/context-value.value-object';

@Public()
@Controller(`${KAKAO_CHATBOT_PREFIX}/ticketing`)
export class KakaoChatbotTicketingController {
  constructor(
    private responseMapper: KaKaoChatbotResponseMapper,
    private carouselMapper: CarouselMapper,
    private contextControlMapper: ContextControlMapper,

    private initTicketUseCase: InitTicketsUseCase,
    private getTicketListCarouselUseCase: GetTicketListCarouselUseCase,
    private getTicketsByCategoryUseCase: GetTicketsByCategoryUseCase,
    private getTicketCommerceCardsCarouselUseCase: GetTicketCommerceCardsCarouselUseCase,
    private getSeatCollectionsByRoomUseCase: GetSeatCollectionsByRoomUseCase,
    private getRoomItemCardsCarousel: GetRoomItemCardsCarouselUseCase,
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

  @Post('category')
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

  @Post('rooms-status')
  async getRoomsStatus(
    @Body(ParseTicketIdFromClientExtraPipe) ticketId: string,
  ): Promise<KakaoChatbotResponseDTO> {
    if (ticketId === null) {
      console.debug(
        new BadRequestException(`ticketId is not included in clientExtra`),
      );

      return ErrorDTOCreator.toSimpleTextOutput('이용권을 먼저 선택해주세요.');
    }

    const roomsOrError = await this.getSeatCollectionsByRoomUseCase.execute();
    if (roomsOrError.isErr()) {
      const error = roomsOrError.error;
      console.debug(new InternalServerErrorException(error));

      return ErrorDTOCreator.toSimpleTextOutput(
        '룸에 대한 정보를 가져오지 못했어요! 다시 시도해주세요.',
      );
    }

    const roomItemCardsCarouselOrError = this.getRoomItemCardsCarousel.execute({
      seatCollectionsByRoom: roomsOrError.value,
      ticketing: true,
    });
    if (roomItemCardsCarouselOrError.isErr()) {
      const error = roomItemCardsCarouselOrError.error;
      console.debug(new InternalServerErrorException(error));

      return ErrorDTOCreator.toSimpleTextOutput(
        '룸에 대한 정보를 출력하는 중에 오류가 발생했어요! 다시 시도해주세요.',
      );
    }

    const context = ContextControl.create({
      values: [
        ContextValue.create({
          name: 'ticketing',
          lifeSpan: 10,
          params: { ticket_id: ticketId },
        }),
      ],
    });

    return this.responseMapper.toDTO({
      outputs: [
        {
          carousel: this.carouselMapper.toDTO(
            roomItemCardsCarouselOrError.value,
          ),
        },
      ],
      context: this.contextControlMapper.toDTO(context),
    });
  }

  // @Post('rooms-status')
  // async getSeatsStatus() {}
}
