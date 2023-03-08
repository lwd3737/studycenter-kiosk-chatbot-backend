import { Module } from '@nestjs/common';
import { TicketModule } from 'src/modules/ticket';
import { KakaoChatbotTicketController } from '../controllers';
import { GetTicketListCarouselUseCase } from '../use-cases';
import { CarouselMapper, ListCardMapper } from './mappers';
import { KaKaoChatbotResponseMapper } from './mappers/kakao-chatbot-response.mapper';

@Module({
  imports: [TicketModule],
  controllers: [KakaoChatbotTicketController],
  providers: [
    KaKaoChatbotResponseMapper,
    ListCardMapper,
    CarouselMapper,
    GetTicketListCarouselUseCase,
  ],
  exports: [],
})
export class KakaoChatbotModule {}
