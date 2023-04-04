import { Module } from '@nestjs/common';
import { SeatManagementModule } from 'src/modules/seat-management';
import { TicketModule } from 'src/modules/ticketing';
import { KakaoChatbotPaymentController } from './controllers/kakao-chatbot-payment.controller';
import { KakaoChatbotTicketController } from './controllers/kakao-chatbot-ticket.controller';
import { ParseTicketCategoryParamPipe } from './pipes/parse-ticket-category-param.pipe';
import { ParseTicketTimeParamPipe } from './pipes/parse-ticket-time-param.pipe';
import { SelectTicketSimpleTextUseCase } from './use-cases/select-ticket-simple-text.use-case.ts/select-ticket-simple-text.use-case';
import { GetTicketCommerceCardsCarouselUseCase } from './use-cases/get-ticket-commerce-cards-carousel/get-ticket-commerce-cards-carousel.use-case';
import { GetTicketListCarouselUseCase } from './use-cases/get-ticket-list-carousel/get-ticket-list-carousel.use-case';
import { ButtonMapper } from './infra/mappers/button.mapper';
import { CarouselMapper } from './infra/mappers/carousel.mapper';

import { CommerceCardMapper } from './infra/mappers/commerce-card.mapper';
import { ContextControlMapper } from './infra/mappers/context-control.mapper';
import { KaKaoChatbotResponseMapper } from './infra/mappers/kakao-chatbot-response.mapper';
import { ListCardMapper } from './infra/mappers/list-card.mapper';
import { ProfileMapper } from './infra/mappers/profile.mapper';
import { SimpleTextMapper } from './infra/mappers/simple-text.mapper';
import { ThumbnailMapper } from './infra/mappers/thumbnail.mapper';
import { KakaoChatbotSeatManagementController } from './controllers/kakao-chatbot-seat-management.controller';
import { GetRoomItemCardsCarouselUseCase } from './use-cases/get-room-item-cards-carousel/get-room-item-cards-carousel.use-case';
import { ItemCardMapper } from './infra/mappers/item-card.mapper';

@Module({
  imports: [TicketModule, SeatManagementModule],
  controllers: [
    KakaoChatbotTicketController,
    KakaoChatbotPaymentController,
    KakaoChatbotSeatManagementController,
  ],
  providers: [
    KaKaoChatbotResponseMapper,
    ListCardMapper,
    ItemCardMapper,
    CarouselMapper,
    CommerceCardMapper,
    ThumbnailMapper,
    ProfileMapper,
    ButtonMapper,
    SimpleTextMapper,
    ContextControlMapper,

    GetTicketListCarouselUseCase,
    GetTicketCommerceCardsCarouselUseCase,
    SelectTicketSimpleTextUseCase,
    GetRoomItemCardsCarouselUseCase,

    ParseTicketCategoryParamPipe,
    ParseTicketTimeParamPipe,
  ],
  exports: [],
})
export class KakaoChatbotModule {}
