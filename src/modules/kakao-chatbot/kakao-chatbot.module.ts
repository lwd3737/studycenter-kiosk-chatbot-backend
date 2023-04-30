import { Module } from '@nestjs/common';
import { SeatManagementModule } from 'src/modules/seat-management';
import { TicketModule } from 'src/modules/ticketing';
import { KakaoChatbotPaymentController } from './controllers/kakao-chatbot-payment.controller';
import { KakaoChatbotTicketingController } from './controllers/kakao-chatbot-ticketing.controller';
import { ParseTicketCategoryParamPipe } from './pipes/parse-ticket-category-param.pipe';
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
import { UseAuthBlockUseCase } from './use-cases/use-auth-block/use-auth-block.use-case';
import { PluginRepo } from './infra/repos/plugin.repo';
import { KakaoChatbotAuthController } from './controllers/kakao-chatbot-auth.controller';
import { ParseSyncOtpParamPipe } from './pipes/parse-sync-otp-param.pipe';
import { AuthModule } from '../auth';
import { MembershipModule } from '../membership';
import { AuthExceptionFilter } from './exception-filters/auth-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [TicketModule, SeatManagementModule, AuthModule, MembershipModule],
  controllers: [
    KakaoChatbotTicketingController,
    KakaoChatbotPaymentController,
    KakaoChatbotSeatManagementController,
    KakaoChatbotAuthController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },

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

    PluginRepo,

    UseAuthBlockUseCase,
    GetTicketListCarouselUseCase,
    GetTicketCommerceCardsCarouselUseCase,
    GetRoomItemCardsCarouselUseCase,

    ParseTicketCategoryParamPipe,
    ParseSyncOtpParamPipe,
  ],
  exports: [],
})
export class KakaoChatbotModule {}
