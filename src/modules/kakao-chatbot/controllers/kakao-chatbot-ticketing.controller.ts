import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  GetAllTicketCollectionsErrors,
  GetTicketsByTypeErrors,
  GetTicketsByTypeUseCase,
  InitTicketsUseCase,
  TicketType,
} from 'src/modules/ticketing';
import { KakaoChatbotResponseDTO } from '../dtos/response.dto.interface';
import { CarouselMapper } from '../infra/mappers/carousel.mapper';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { ParseTicketTypeParamPipe } from '../pipes/parse-ticket-category-param.pipe';
import { RenderTicketCommerceCardsCarouselUseCase } from '../use-cases/render-ticket-commerce-cards-carousel/render-ticket-commerce-cards-carousel.use-case';
import { RenderTicketCollectionListCarouselUseCase } from '../use-cases/render-ticket-collection-list-carousel/render-ticket-collection-list-carousel.use-case';
import { ErrorDTOCreator } from '../dtos/error.dto';
import { TicketTemplateDTOCreator } from '../dtos/ticket-template.dto';
import { KAKAO_CHATBOT_PREFIX } from './controller-prefix';
import {
  ParseTicketingFromClientExtraPipe,
  TicketingClientExtraResult,
} from '../pipes/parse-ticketing-from-client-extra.pipe';
import { GetRoomSeatsGroupUseCase } from 'src/modules/seat-management';
import { RenderRoomItemCardsCarouselUseCase } from '../use-cases/render-room-item-cards-carousel/render-room-item-cards-carousel.use-case';
import { ContextControlMapper } from '../infra/mappers/context-control.mapper';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { GetAvailableRoomSeatsUseCase } from 'src/modules/seat-management/use-cases/get-available-room-seats.use-case.ts/get-available-room-seats.use-case';
import { RenderAvailableSeatsListCardsCarouselUseCase } from '../use-cases/render-available-seats-list-cards-carousel/render-available-seats-list-cards-carousel.use-case';
import { SimpleTextMapper } from '../infra/mappers/simple-text.mapper';
import { ContextControl } from '../domain/base/context-control/context-control.value-object';

@Public()
@Controller(`${KAKAO_CHATBOT_PREFIX}/ticketing`)
export class KakaoChatbotTicketingController {
  constructor(
    private responseMapper: KaKaoChatbotResponseMapper,
    private carouselMapper: CarouselMapper,
    private simpleTextMapper: SimpleTextMapper,
    private contextControlMapper: ContextControlMapper,

    private initTicketUseCase: InitTicketsUseCase,
    private renderTicketListCarouselUseCase: RenderTicketCollectionListCarouselUseCase,
    private getTicketsByTypeUseCase: GetTicketsByTypeUseCase,
    private renderTicketCommerceCardsCarouselUseCase: RenderTicketCommerceCardsCarouselUseCase,
    private getRoomSeatsGroupUseCase: GetRoomSeatsGroupUseCase,
    private renderRoomItemCardsCarousel: RenderRoomItemCardsCarouselUseCase,
    private getAvailableSeatsUseCase: GetAvailableRoomSeatsUseCase,
    private renderAvailableSeatsListCardsCarouselUseCase: RenderAvailableSeatsListCardsCarouselUseCase,
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

  @Post('ticket-all-collections')
  async getAllTicketCollections(): Promise<KakaoChatbotResponseDTO> {
    const ticketListCarouselOrError =
      await this.renderTicketListCarouselUseCase.execute();
    if (ticketListCarouselOrError.isErr()) {
      const error = ticketListCarouselOrError.error;

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
          carousel: this.carouselMapper.toDTO(ticketListCarouselOrError.value),
        },
      ],
    });
  }

  @Post('ticket-collection-by-type')
  async getTicketCollectionByType(
    @Body(ParseTicketTypeParamPipe) ticketType: TicketType,
  ): Promise<KakaoChatbotResponseDTO> {
    const ticketCollectionByTypeOrError =
      await this.getTicketsByTypeUseCase.execute({
        type: ticketType,
      });
    if (ticketCollectionByTypeOrError.isErr()) {
      const error = ticketCollectionByTypeOrError.error;
      console.debug(error);

      switch (error.constructor) {
        case GetTicketsByTypeErrors.TicketNotFoundError:
          return ErrorDTOCreator.toSimpleTextOutput(
            `${ticketType} 이용권은 존재하지 않는 이용권이에요. 아래 이용권 중에 선택해주세요!`,
            TicketTemplateDTOCreator.toTicketTypesQuickReplies(),
          );
        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            '이용권 목록을 불러오는데 실패했어요. 다시 시도해주세요!',
          );
      }
    }

    const ticketCommerceCardsCarouselOrError =
      await this.renderTicketCommerceCardsCarouselUseCase.execute({
        tickets: ticketCollectionByTypeOrError.value,
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
    @Body(new ParseTicketingFromClientExtraPipe())
    ticketingOrError: TicketingClientExtraResult,
  ): Promise<KakaoChatbotResponseDTO> {
    if (ticketingOrError.isErr()) return ticketingOrError.error;

    const roomsOrError = await this.getRoomSeatsGroupUseCase.execute();
    if (roomsOrError.isErr()) {
      const error = roomsOrError.error;
      console.debug(new InternalServerErrorException(error));

      return ErrorDTOCreator.toSimpleTextOutput(
        '룸에 대한 정보를 가져오지 못했어요!',
      );
    }

    const roomItemCardsCarouselOrError =
      this.renderRoomItemCardsCarousel.execute({
        roomSeatsGroup: roomsOrError.value,
        ticketing: ticketingOrError.value,
      });
    if (roomItemCardsCarouselOrError.isErr()) {
      const error = roomItemCardsCarouselOrError.error;
      console.debug(new InternalServerErrorException(error));

      return ErrorDTOCreator.toSimpleTextOutput(
        '룸에 대한 정보를 출력하는 중에 오류가 발생했어요!',
      );
    }

    return this.responseMapper.toDTO({
      outputs: [
        {
          carousel: this.carouselMapper.toDTO(
            roomItemCardsCarouselOrError.value,
          ),
        },
      ],
    });
  }

  @Post('available-seats')
  async availableSeats(
    @Body(
      new ParseTicketingFromClientExtraPipe({
        required: {
          room_id: true,
        },
      }),
    )
    ticketingOrError: TicketingClientExtraResult,
  ) {
    if (ticketingOrError.isErr()) return ticketingOrError.error;
    const ticketing = ticketingOrError.value;

    const availableSeatsOrError = await this.getAvailableSeatsUseCase.execute({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      roomId: ticketing.room_id!,
    });
    if (availableSeatsOrError.isErr()) {
      const error = availableSeatsOrError.error;

      switch (error.constructor) {
        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            `좌석을 불러오는데 실패했어요!`,
          );
      }
    }
    const { room, seats } = availableSeatsOrError.value;

    const carouselsOrError =
      this.renderAvailableSeatsListCardsCarouselUseCase.execute({
        ticketId: ticketing.ticket_id,
        room,
        seats: seats,
      });
    if (carouselsOrError.isErr()) {
      const error = carouselsOrError.error;
      console.debug(error);

      switch (error.constructor) {
        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            `좌석을 불러오는데 실패했어요!`,
          );
      }
    }

    return this.responseMapper.toDTO({
      outputs: [
        ...carouselsOrError.value.map((carousel) => ({
          carousel: this.carouselMapper.toDTO(carousel),
        })),
      ],
      context: this.contextControlMapper.toDTO(
        ContextControl.create({
          values: [
            {
              name: 'ticketing',
              lifeSpan: 10,
              params: {
                ...ticketing,
              },
            },
          ],
        }),
      ),
    });
  }

  @Post('virtual-account')
  async issueVirtualAccount(
    @Body(
      new ParseTicketingFromClientExtraPipe({
        required: {
          room_id: true,
          seat_id: true,
        },
      }),
    )
    ticketingOrError: TicketingClientExtraResult,
  ) {
    if (ticketingOrError.isErr()) return ticketingOrError.error;

    return this.responseMapper.toDTO({
      outputs: [
        {
          simpleText: {
            text: `test: ${JSON.stringify(ticketingOrError.value)}`,
          },
        },
      ],
    });
  }
}
