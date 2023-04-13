import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { GetRoomsStatusUseCase } from 'src/modules/seat-management';
import { ContextControl } from '../domain/context-control/context-control.value-object';
import { ContextValue } from '../domain/context-control/context-value.value-object';
import { KakaoChatbotResponseDTO } from '../dtos/kakao-chatbot-response.dto.interface';
import { CarouselMapper } from '../infra/mappers/carousel.mapper';
import { ContextControlMapper } from '../infra/mappers/context-control.mapper';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { ParseTicketIdFromClientExtraPipe } from '../pipes/parse-ticket-id-from-client-extra.pipe';
import { GetRoomItemCardsCarouselUseCase } from '../use-cases/get-room-item-cards-carousel/get-room-item-cards-carousel.use-case';

@Controller('kakao-chatbot')
export class KakaoChatbotSeatManagementController {
  constructor(
    private getRoomsStatusUseCase: GetRoomsStatusUseCase,
    private getRoomItemCardsCarousel: GetRoomItemCardsCarouselUseCase,
    private repoponseMapper: KaKaoChatbotResponseMapper,
    private carouselMapper: CarouselMapper,
    private contextControlMapper: ContextControlMapper,
  ) {}

  @Post('rooms/status')
  async getRoomsStatus(
    @Body(ParseTicketIdFromClientExtraPipe) ticketId: string,
  ): Promise<KakaoChatbotResponseDTO> {
    const roomsResult = await this.getRoomsStatusUseCase.execute();
    if (roomsResult.isErr()) {
      const error = roomsResult.error;
      console.debug(error);

      throw new InternalServerErrorException();
    }

    const roomItemCardsCarouselResult = this.getRoomItemCardsCarousel.execute({
      rooms: roomsResult.value,
    });
    if (roomItemCardsCarouselResult.isErr()) {
      const error = roomItemCardsCarouselResult.error;
      console.debug(error);

      throw new InternalServerErrorException(error);
    }

    const context = ContextControl.create({
      values: [
        ContextValue.create({
          name: 'ticketing',
          lifeSpan: 10,
          params: { selected_ticket_id: ticketId },
        }),
      ],
    });

    return this.repoponseMapper.toDTO({
      outputs: [
        {
          carousel: this.carouselMapper.toDTO(
            roomItemCardsCarouselResult.value,
          ),
        },
      ],
      context: this.contextControlMapper.toDTO(context),
    });
  }

  // @Post('seats/status')
  // async getSeatStatus(@Body()) {

  // }
}
