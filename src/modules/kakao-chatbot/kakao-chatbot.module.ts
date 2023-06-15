import { Module } from '@nestjs/common';
import { SeatManagementModule } from 'src/modules/seat-management';
import { TicketModule } from 'src/modules/ticketing';
import { KakaoChatbotTicketingController } from './controllers/kakao-chatbot-ticketing.controller';
import { ParseTicketTypeParamPipe } from './pipes/parse-ticket-category-param.pipe';
import { RenderTicketCommerceCardsCarouselUseCase } from './use-cases/render-ticket-commerce-cards-carousel/render-ticket-commerce-cards-carousel.use-case';
import { RenderTicketCollectionListCarouselUseCase } from './use-cases/render-ticket-collection-list-carousel/render-ticket-collection-list-carousel.use-case';
import { CarouselMapper } from './infra/mappers/carousel.mapper';
import { CommerceCardMapper } from './infra/mappers/commerce-card.mapper';
import { ContextControlMapper } from './infra/mappers/context-control.mapper';
import { KaKaoChatbotResponseMapper } from './infra/mappers/kakao-chatbot-response.mapper';
import { ProfileMapper } from './infra/mappers/profile.mapper';
import { SimpleTextMapper } from './infra/mappers/simple-text.mapper';
import { ThumbnailMapper } from './infra/mappers/thumbnail.mapper';
import { KakaoChatbotSeatManagementController } from './controllers/kakao-chatbot-seat-management.controller';
import { RenderRoomItemCardsCarouselUseCase } from './use-cases/render-room-item-cards-carousel/render-room-item-cards-carousel.use-case';
import { ItemCardMapper } from './infra/mappers/item-card.mapper';
import { UseAuthBlockUseCase } from './use-cases/use-auth-block/use-auth-block.use-case';
import { PluginRepo } from './infra/repos/plugin.repo';
import { KakaoChatbotAuthController } from './controllers/kakao-chatbot-auth.controller';
import { ParseSyncOtpParamPipe } from './pipes/parse-sync-otp-param.pipe';
import { AuthModule } from '../auth';
import { MembershipModule } from '../membership';
import { AuthExceptionFilter } from './exception-filters/auth-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { RenderAvailableSeatsListCardsCarouselUseCase } from './use-cases/render-available-seats-list-cards-carousel/render-available-seats-list-cards-carousel.use-case';

const Mappers = [
  KaKaoChatbotResponseMapper,
  ItemCardMapper,
  CarouselMapper,
  CommerceCardMapper,
  ThumbnailMapper,
  ProfileMapper,
  SimpleTextMapper,
  ContextControlMapper,
];

const Repos = [PluginRepo];

const UseCases = [
  UseAuthBlockUseCase,
  RenderTicketCollectionListCarouselUseCase,
  RenderTicketCommerceCardsCarouselUseCase,
  RenderRoomItemCardsCarouselUseCase,
  RenderAvailableSeatsListCardsCarouselUseCase,
];

const Pipes = [ParseTicketTypeParamPipe, ParseSyncOtpParamPipe];

@Module({
  imports: [TicketModule, SeatManagementModule, AuthModule, MembershipModule],
  controllers: [
    KakaoChatbotTicketingController,
    KakaoChatbotSeatManagementController,
    KakaoChatbotAuthController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },

    ...Mappers,
    ...Repos,
    ...UseCases,
    ...Pipes,
  ],
  exports: [],
})
export class KakaoChatbotModule {}
