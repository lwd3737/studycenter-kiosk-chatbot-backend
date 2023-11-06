import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  InitTicketsUseCase,
  TicketNotFoundError,
  TicketType,
} from 'src/modules/ticketing';
import { KakaoChatbotResponseDTO } from '../application/dtos/IResponse.dto';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { ErrorDTOCreator } from '../application/dtos/error.dto';
import { KAKAO_CHATBOT_PREFIX } from './controller-prefix';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { ListCardCarouselMapper } from '../infra/mappers/list-card-carousel.mapper';
import { CommerceCardCarouselMapper } from '../infra/mappers/commerce-card-carousel.mapper';
import { ItemCardCarouselMapper } from '../infra/mappers/item-card-carousel.mapper';
import { SelectTicketAndGetAllRoomsUseCase } from '../application/usecases/ticketing/select-ticket-and-get-all-rooms/select-ticket-and-get-all-rooms.usecase';
import { GetAvailableSeatsUseCase } from '../application/usecases/ticketing/get-available-seats/get-available-seats.usecase';
import { ParseTicketTypeParamPipe } from '../application/pipes/parse-ticket-category-param.pipe';
import { ParseAppUserIdParamPipe } from '../application/pipes/parse-app-user-id-param.pipe';
import { TextCardMapper } from '../infra/mappers/text-card.mapper';
import {
  ParseClientExtraPipe,
  ParseClientExtraResult,
} from '../application/pipes/parse-client-extra.pipe';
import { GetTicketGroupsUseCase } from '../application/usecases/ticketing/get-ticket-groups/get-ticket-groups.usecase';
import { GetTicketGroupUseCase } from '../application/usecases/ticketing/get-ticket-group/get-ticket-group.usecase';
import { SelectSeatAndConfirmTicketPurchaseInfoUseCase } from '../application/usecases/ticketing/select-seat-and-confirm-ticket-purchase-info/select-seat-and-confirm-ticket-purchase-info.usecase';
import { IssueVirtualAccountUseCase } from '../application/usecases/ticketing/issue-virtual-account/issue-virtual-account.usecase';

@Controller(`${KAKAO_CHATBOT_PREFIX}/ticketing`)
export class KakaoChatbotTicketingController {
  constructor(
    private initTicketUseCase: InitTicketsUseCase,
    private getTicketGroupsUseCase: GetTicketGroupsUseCase,
    private getTicketGroupUseCase: GetTicketGroupUseCase,
    private selectTicketAndGetAllRoomsUseCase: SelectTicketAndGetAllRoomsUseCase,
    private getAvailableSeats: GetAvailableSeatsUseCase,
    private confirmTicketPurchaseInfoUseCase: SelectSeatAndConfirmTicketPurchaseInfoUseCase,
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

  @Post('select-ticket-and-get-all-rooms')
  async selectTicketAndGetAllRooms(
    @Body(new ParseAppUserIdParamPipe()) appUserId: string,
    @Body(new ParseClientExtraPipe<{ ticketId: string }>(['ticketId']))
    clientExtraOrError: ParseClientExtraResult<{ ticketId: string }>,
  ): Promise<KakaoChatbotResponseDTO> {
    if (clientExtraOrError.isErr()) return clientExtraOrError.error;

    const roomItemCardCarouselOrError =
      await this.selectTicketAndGetAllRoomsUseCase.execute({
        appUserId,
        ticketId: clientExtraOrError.value.ticketId,
      });
    if (roomItemCardCarouselOrError.isErr()) {
      const error = roomItemCardCarouselOrError.error;
      console.debug(new InternalServerErrorException(error));

      return ErrorDTOCreator.toSimpleTextOutput(
        '룸에 대한 정보를 출력하는 중에 오류가 발생했어요!',
      );
    }

    return KaKaoChatbotResponseMapper.toDTO({
      outputs: [
        {
          carousel: ItemCardCarouselMapper.toDTO(
            roomItemCardCarouselOrError.value,
          ),
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

  @Post('select-seat-and-confirm-purchase-info')
  async confirmPurchaseInfo(
    @Body(new ParseAppUserIdParamPipe()) appUserId: string,
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
  async issueVirtualAccount(
    @Body(new ParseAppUserIdParamPipe()) appUserId: string,
  ) {
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
