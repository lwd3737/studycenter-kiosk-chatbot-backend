import { Controller, Post } from '@nestjs/common';
import { GetRoomSeatsGroupUseCase } from 'src/modules/seat-management';
import { KakaoChatbotResponseDTO } from '../dtos/response.dto.interface';
import { CarouselMapper } from '../infra/mappers/carousel.mapper';
import { KaKaoChatbotResponseMapper } from '../infra/mappers/kakao-chatbot-response.mapper';
import { RenderRoomItemCardsCarouselUseCase } from '../use-cases/render-room-item-cards-carousel/render-room-item-cards-carousel.use-case';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { ErrorDTOCreator } from '../dtos/error.dto';
import { KAKAO_CHATBOT_PREFIX } from './controller-prefix';

@Public()
@Controller(`${KAKAO_CHATBOT_PREFIX}/seat-management`)
export class KakaoChatbotSeatManagementController {
  constructor(
    private getRoomsStatusUseCase: GetRoomSeatsGroupUseCase,
    private getRoomItemCardsCarousel: RenderRoomItemCardsCarouselUseCase,
    private repoponseMapper: KaKaoChatbotResponseMapper,
    private carouselMapper: CarouselMapper,
  ) {}

  @Post('rooms-status')
  async getRoomsStatus(): Promise<KakaoChatbotResponseDTO> {
    const roomsOrError = await this.getRoomsStatusUseCase.execute();
    if (roomsOrError.isErr()) {
      const error = roomsOrError.error;
      console.debug(error);

      return ErrorDTOCreator.toSimpleTextOutput(
        '룸에 대한 정보를 가져오지 못했어요! 다시 시도해주세요.',
      );
    }

    const roomItemCardsCarouselOrError = this.getRoomItemCardsCarousel.execute({
      roomSeatsGroup: roomsOrError.value,
    });
    if (roomItemCardsCarouselOrError.isErr()) {
      const error = roomItemCardsCarouselOrError.error;
      console.debug(error);

      return ErrorDTOCreator.toSimpleTextOutput(
        '룸에 대한 정보를 출력하는 중에 오류가 발생했어요! 다시 시도해주세요.',
      );
    }

    return this.repoponseMapper.toDTO({
      outputs: [
        {
          carousel: this.carouselMapper.toDTO(
            roomItemCardsCarouselOrError.value,
          ),
        },
      ],
    });
  }

  // @Post('seats-status')
  // async getSeatsStatus(@Body()) {

  // }
}
