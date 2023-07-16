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
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { ParseTicketTypeParamPipe } from '../pipes/parse-ticket-category-param.pipe';
import { RenderTicketCommerceCardsCarouselUseCase } from '../usecases/render-ticket-commerce-cards-carousel/render-ticket-commerce-cards-carousel.usecase';
import { RenderTicketCollectionListCardCarouselUseCase } from '../usecases/render-ticket-collection-list-card-carousel/render-ticket-collection-list-card-carousel.usecase';
import { ErrorDTOCreator } from '../dtos/error.dto';
import { TicketTemplateDTOCreator } from '../dtos/ticket-template.dto';
import { KAKAO_CHATBOT_PREFIX } from './controller-prefix';
import {
  ParseTicketingFromClientExtraPipe,
  TicketingInfoClientExtraResult,
} from '../pipes/parse-ticketing-from-client-extra.pipe';
import { GetRoomSeatsGroupUseCase } from 'src/modules/seat-management';
import { RenderRoomItemCardsCarouselUseCase } from '../usecases/render-room-item-cards-carousel/render-room-item-cards-carousel.usecase';
import { ContextControlMapper } from '../infra/mappers/context-control.mapper';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { GetAvailableRoomSeatsUseCase } from 'src/modules/seat-management/use-cases/get-available-room-seats.use-case.ts/get-available-room-seats.use-case';
import { RenderAvailableSeatsListCardsCarouselUseCase } from '../usecases/render-available-seats-list-cards-carousel/render-available-seats-list-cards-carousel.usecase';
import { SimpleTextMapper } from '../infra/mappers/simple-text.mapper';
import { ContextControl } from '../domain/base/context-control/context-control.value-object';
import { ListCardCarouselMapper } from '../infra/mappers/list-card-carousel.mapper';
import { CommerceCardCarouselMapper } from '../infra/mappers/commerce-card-carousel.mapper';
import { ItemCardCarouselMapper } from '../infra/mappers/item-card-carousel.mapper';
import { IssueVirtualAccountUseCase } from 'src/modules/payment';
import { ParseAppUserIdParamPipe } from '../pipes/parse-app-user-id-param.pipe';
import { GetMemberUseCase } from 'src/modules/membership';
import { TemplateVirtualAccountUseCase } from '../usecases/template-virtual-account-issuance-simple-text/template-virtual-account-issuance-simple-text.usecase';
import { TemplateVirtualAccountIssuanceErrors } from '../usecases/template-virtual-account-issuance-simple-text/error';

@Public()
@Controller(`${KAKAO_CHATBOT_PREFIX}/ticketing`)
export class KakaoChatbotTicketingController {
  constructor(
    private initTicketUseCase: InitTicketsUseCase,
    private renderTicketListCarouselUseCase: RenderTicketCollectionListCardCarouselUseCase,
    private getTicketsByTypeUseCase: GetTicketsByTypeUseCase,
    private renderTicketCommerceCardsCarouselUseCase: RenderTicketCommerceCardsCarouselUseCase,
    private getRoomSeatsGroupUseCase: GetRoomSeatsGroupUseCase,
    private renderRoomItemCardsCarousel: RenderRoomItemCardsCarouselUseCase,
    private getAvailableSeatsUseCase: GetAvailableRoomSeatsUseCase,
    private renderAvailableSeatsListCardsCarouselUseCase: RenderAvailableSeatsListCardsCarouselUseCase,
    private templateVirtualAccountUseCase: TemplateVirtualAccountUseCase,
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

    return KaKaoChatbotResponseMapper.toDTO({
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

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        {
          carousel: ListCardCarouselMapper.toDTO(
            ticketListCarouselOrError.value,
          ),
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

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        {
          carousel: CommerceCardCarouselMapper.toDTO(
            ticketCommerceCardsCarouselOrError.value,
          ),
        },
      ],
    });
  }

  @Post('rooms-status')
  async getRoomsStatus(
    @Body(new ParseTicketingFromClientExtraPipe())
    ticketingOrError: TicketingInfoClientExtraResult,
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

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        {
          carousel: ItemCardCarouselMapper.toDTO(
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
    ticketingOrError: TicketingInfoClientExtraResult,
  ) {
    if (ticketingOrError.isErr()) return ticketingOrError.error;
    const ticketing = ticketingOrError.value;

    const availableSeatsOrError = await this.getAvailableSeatsUseCase.execute({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      roomId: ticketing.roomId!,
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
        ticketId: ticketing.ticketId,
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

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        ...carouselsOrError.value.map((carousel) => ({
          carousel: ListCardCarouselMapper.toDTO(carousel),
        })),
      ],
      context: ContextControlMapper.toDTO(
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
    ticketingInfoOrError: TicketingInfoClientExtraResult,
    @Body(new ParseAppUserIdParamPipe()) appUserId: string,
  ) {
    if (ticketingInfoOrError.isErr()) return ticketingInfoOrError.error;
    const ticketingInfo = ticketingInfoOrError.value;
    if (!ticketingInfo.roomId)
      return ErrorDTOCreator.toSimpleTextOutput('룸을 선택해주세요!');
    if (!ticketingInfo.ticketId)
      return ErrorDTOCreator.toSimpleTextOutput('이용권을 선택해주세요!');
    const simpleTextOrError = await this.templateVirtualAccountUseCase.execute({
      appUserId,
      ticketId: ticketingInfo.ticketId,
      roomId: ticketingInfo.roomId,
    });
    if (simpleTextOrError.isErr()) {
      const error = simpleTextOrError.error;
      console.debug(error);

      switch (error.constructor) {
        case TemplateVirtualAccountIssuanceErrors.MemberNotFound:
          return ErrorDTOCreator.toSimpleTextOutput(
            '계정을 불러오는데 실패했어요!',
          );
        case TemplateVirtualAccountIssuanceErrors.TicketNotFound:
          return ErrorDTOCreator.toSimpleTextOutput(
            '이용권을 불러오는데 실패했어요!',
          );
        default:
          return ErrorDTOCreator.toSimpleTextOutput(
            '가상계좌 발급에 실패했어요!',
          );
      }
    }
    const simpleText = simpleTextOrError.value;

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        {
          simpleText: {
            text: simpleText.value,
          },
        },
      ],
    });
  }
}
