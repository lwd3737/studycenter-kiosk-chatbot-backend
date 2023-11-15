import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { InitTicketsUseCase, TicketType } from 'src/modules/ticketing';
import { KakaoChatbotResponseDTO } from '../application/dtos/IResponse.dto';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { ErrorDTOCreator } from '../application/dtos/error.dto';
import { KAKAO_CHATBOT_PREFIX } from './controller-prefix';
import { ListCardCarouselMapper } from '../infra/mappers/list-card-carousel.mapper';
import { CommerceCardCarouselMapper } from '../infra/mappers/commerce-card-carousel.mapper';
import { ItemCardCarouselMapper } from '../infra/mappers/item-card-carousel.mapper';
import { GetAllRoomsUseCase } from '../application/usecases/ticketing/get-all-rooms/get-all-rooms.usecase';
import { GetAvailableSeatsInRoomUseCase } from '../application/usecases/ticketing/get-available-seats-in-room/get-available-seats-in-room.usecase';
import { ParseTicketTypeParamPipe } from '../application/pipes/parse-ticket-category-param.pipe';
import { ParseAppUserIdParamPipe } from '../application/pipes/parse-app-user-id-param.pipe';
import { TextCardMapper } from '../infra/mappers/text-card.mapper';
import {
  ParseClientExtraPipe,
  ParseClientExtraResult,
} from '../application/pipes/parse-client-extra.pipe';
import { GetTicketGroupsUseCase } from '../application/usecases/ticketing/get-ticket-groups/get-ticket-groups.usecase';
import { GetTicketGroupUseCase } from '../application/usecases/ticketing/get-ticket-group/get-ticket-group.usecase';
import { ConfirmTicketPurchaseInfoUseCase } from '../application/usecases/ticketing/confirm-ticket-purchase-info/confirm-ticket-purchase-info.usecase';
import { IssueVirtualAccountUseCase } from '../application/usecases/ticketing/issue-virtual-account/issue-virtual-account.usecase';
import {
  TicketNotFoundError,
  TicketNotSelectedError,
} from '../application/usecases/ticketing/confirm-ticket-purchase-info/confirm-ticket-purchase-info.error';
import { New__ParseClientExtraPipe } from '../application/pipes/new-parse-client-extra.pipe';

@Controller(`${KAKAO_CHATBOT_PREFIX}/ticketing`)
export class KakaoChatbotTicketingController {
  constructor(
    private initTicketUseCase: InitTicketsUseCase,
    private getTicketGroupsUseCase: GetTicketGroupsUseCase,
    private getTicketGroupUseCase: GetTicketGroupUseCase,
    private getAllRoomsUseCase: GetAllRoomsUseCase,
    private getAvailableSeats: GetAvailableSeatsInRoomUseCase,
    private confirmTicketPurchaseInfoUseCase: ConfirmTicketPurchaseInfoUseCase,
    private issueVirtualAccountUseCase: IssueVirtualAccountUseCase,
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

  @Post('ticket-groups')
  async getTicketGroups(): Promise<KakaoChatbotResponseDTO> {
    const ticketGroupListCarouselOrError =
      await this.getTicketGroupsUseCase.execute();
    if (ticketGroupListCarouselOrError.isErr()) {
      const error = ticketGroupListCarouselOrError.error;

      console.debug(error);

      switch (error.constructor) {
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
            ticketGroupListCarouselOrError.value,
          ),
        },
      ],
    });
  }

  @Post('ticket-group')
  async getTicketGroup(
    @Body(ParseTicketTypeParamPipe) ticketType: TicketType,
  ): Promise<KakaoChatbotResponseDTO> {
    const ticketCommerceCardCarouselOrError =
      await this.getTicketGroupUseCase.execute({
        ticketType,
      });

    if (ticketCommerceCardCarouselOrError.isErr()) {
      const error = ticketCommerceCardCarouselOrError.error;
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
            ticketCommerceCardCarouselOrError.value,
          ),
        },
      ],
    });
  }

  @Post('all-rooms')
  async getAllRooms(
    @Body(ParseAppUserIdParamPipe) appUserId: string,
    @Body(new New__ParseClientExtraPipe(['ticketId']))
    clientExtra: { ticketId: string },
  ): Promise<KakaoChatbotResponseDTO> {
    const carouselOrError = await this.getAllRoomsUseCase.execute({
      appUserId,
      ticketId: clientExtra.ticketId,
    });

    if (carouselOrError.isErr()) {
      const error = carouselOrError.error;
      console.debug(new InternalServerErrorException(error));

      return ErrorDTOCreator.toSimpleTextOutput(
        '전체 방 조회 중에 오류가 발생했어요!',
      );
    }

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        {
          carousel: ItemCardCarouselMapper.toDTO(carouselOrError.value),
        },
      ],
    });
  }

  @Post('available-seats')
  async availableSeats(
    @Body(new ParseClientExtraPipe<{ roomId: string }>(['roomId']))
    clientExtraOrError: ParseClientExtraResult<{ roomId: string }>,
  ) {
    if (clientExtraOrError.isErr()) return clientExtraOrError.error;

    const carouselsOrError = await this.getAvailableSeats.execute({
      roomId: clientExtraOrError.value.roomId,
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
    });
  }

  @Post('confirm-purchase-info')
  async selectSeatAndConfirmPurchaseInfo(
    @Body(ParseAppUserIdParamPipe) appUserId: string,
    @Body(new ParseClientExtraPipe<{ seatId: string }>(['seatId']))
    clientExtraOrError: ParseClientExtraResult<{ seatId: string }>,
  ) {
    if (clientExtraOrError.isErr()) return clientExtraOrError.error;

    const textCardOrError = await this.confirmTicketPurchaseInfoUseCase.execute(
      {
        appUserId,
        seatId: clientExtraOrError.value.seatId,
      },
    );
    if (textCardOrError.isErr()) {
      const error = textCardOrError.error;
      console.debug(error);

      if (error instanceof TicketNotSelectedError)
        return ErrorDTOCreator.toSimpleTextOutput('이용권을 선택해주세요!');
      if (error instanceof TicketNotFoundError)
        return ErrorDTOCreator.toSimpleTextOutput('이용권을 찾을 수 없어요!');
      return ErrorDTOCreator.toSimpleTextOutput(
        `구매정보를 불러오는데 실패했어요!`,
      );
    }
    const textCard = textCardOrError.value;

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        {
          textCard: TextCardMapper.toDTO(textCard),
        },
      ],
    });
  }

  @Post('virtual-account')
  async issueVirtualAccount(@Body(ParseAppUserIdParamPipe) appUserId: string) {
    const simpleTextOrError = await this.issueVirtualAccountUseCase.execute({
      appUserId,
    });
    if (simpleTextOrError.isErr()) {
      const error = simpleTextOrError.error;
      console.debug(error);

      return ErrorDTOCreator.toSimpleTextOutput('가상계좌 발급에 실패했어요!');
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
