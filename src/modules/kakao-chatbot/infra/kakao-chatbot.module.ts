import { Module } from '@nestjs/common';
import { TicketModule } from 'src/modules/ticket';
import { KakaoChatbotTicketController } from '../controllers';
import {
  GetTicketCommerceCardsCarouselUseCase,
  GetTicketListCarouselUseCase,
} from '../use-cases';
import {
  ButtonMapper,
  CarouselMapper,
  ListCardMapper,
  ThumbnailMapper,
} from './mappers';
import { CommerceCardMapper } from './mappers/commerce-card.mapper';
import { KaKaoChatbotResponseMapper } from './mappers/kakao-chatbot-response.mapper';

@Module({
  imports: [TicketModule],
  controllers: [KakaoChatbotTicketController],
  providers: [
    KaKaoChatbotResponseMapper,
    ListCardMapper,
    CarouselMapper,
    CommerceCardMapper,
    ThumbnailMapper,
    ButtonMapper,
    GetTicketListCarouselUseCase,
    GetTicketCommerceCardsCarouselUseCase,
  ],
  exports: [],
})
export class KakaoChatbotModule {}
