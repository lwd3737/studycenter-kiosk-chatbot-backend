import { Module } from '@nestjs/common';
import { TicketModule } from 'src/modules/ticket';
import { KakaoChatbotPaymentController } from '../controllers/kakao-chatbot-payment.controller';
import { KakaoChatbotTicketController } from '../controllers/kakao-chatbot-ticket.controller';
import { ParseTicketCategoryParamPipe } from '../pipes/parse-ticket-category-param.pipe';
import { GetTicketCommerceCardsCarouselUseCase } from '../use-cases/get-ticket-commerce-cards-carousel/get-ticket-commerce-cards-carousel.use-case';
import { GetTicketListCarouselUseCase } from '../use-cases/get-ticket-list-carousel/get-ticket-list-carousel.use-case';
import { ButtonMapper } from './mappers/button.mapper';
import { CarouselMapper } from './mappers/carousel.mapper';

import { CommerceCardMapper } from './mappers/commerce-card.mapper';
import { KaKaoChatbotResponseMapper } from './mappers/kakao-chatbot-response.mapper';
import { ListCardMapper } from './mappers/list-card.mapper';
import { ProfileMapper } from './mappers/profile.mapper';
import { ThumbnailMapper } from './mappers/thumbnail.mapper';

@Module({
  imports: [TicketModule],
  controllers: [KakaoChatbotTicketController, KakaoChatbotPaymentController],
  providers: [
    KaKaoChatbotResponseMapper,
    ListCardMapper,
    CarouselMapper,
    CommerceCardMapper,
    ThumbnailMapper,
    ProfileMapper,
    ButtonMapper,

    GetTicketListCarouselUseCase,
    GetTicketCommerceCardsCarouselUseCase,

    ParseTicketCategoryParamPipe,
  ],
  exports: [],
})
export class KakaoChatbotModule {}
