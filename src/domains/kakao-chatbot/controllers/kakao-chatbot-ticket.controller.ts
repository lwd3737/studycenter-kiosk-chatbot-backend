import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { GetTicketCollectionByCategoryUseCase } from 'src/domains/ticket';
import { TicketNotFoundError } from 'src/domains/ticket/application/errors';
import { IKakaoChatbotRequestDTO, IKakaoChatbotResponseDTO } from '../dtos';
import { KaKaoChatbotResponseMapper, CarouselMapper } from '../infra/mappers';
import { GetTicketListCarouselUseCase } from '../use-cases';

@Controller('kakao-chatbot/ticket')
export class KakaoChatbotTicketController {
  constructor(
    private getTicketListCarouselUseCase: GetTicketListCarouselUseCase,
    private getTicketCollectionByCategoryUseCase: GetTicketCollectionByCategoryUseCase,
    private responseMapper: KaKaoChatbotResponseMapper,
    private carouselMapper: CarouselMapper,
  ) {}

  @Post('collections')
  async getAllTicketCollections(): Promise<IKakaoChatbotResponseDTO> {
    const ticketListCarouselResult =
      await this.getTicketListCarouselUseCase.execute();
    if (ticketListCarouselResult.isErr()) {
      const error = ticketListCarouselResult.error;
      console.debug(error);

      switch (error.constructor) {
        case TicketNotFoundError:
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

  @Post('collection/by-category')
  async getTicketCollectionByCategory(
    @Body() request: IKakaoChatbotRequestDTO,
  ) {
    console.log(JSON.stringify(request, null, 2));

    const categoryDTO = request.action.clientExtra?.category;
    if (!categoryDTO) {
      throw new BadRequestException('client extra "category" not included');
    }

    const ticketsResult =
      await this.getTicketCollectionByCategoryUseCase.execute({
        category: categoryDTO as string,
      });
    if (ticketsResult.isErr()) {
      const error = ticketsResult.error;

      switch (error.constructor) {
        case TicketNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(error.message, {
            cause: error,
          });
      }
    }

    return ticketsResult.value;
  }
}
