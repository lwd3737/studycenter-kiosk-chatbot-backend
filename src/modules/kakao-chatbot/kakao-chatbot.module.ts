import { Module } from '@nestjs/common';
import { SeatManagementModule } from 'src/modules/seat-management';
import { TicketModule } from 'src/modules/ticketing';
import { KakaoChatbotTicketingController } from './controllers/kakao-chatbot-ticketing.controller';
import { ParseTicketTypeParamPipe } from './pipes/parse-ticket-category-param.pipe';
import { RenderTicketCommerceCardsCarouselUseCase } from './usecases/render-ticket-commerce-cards-carousel/render-ticket-commerce-cards-carousel.usecase';
import { RenderTicketCollectionListCardCarouselUseCase } from './usecases/render-ticket-collection-list-card-carousel/render-ticket-collection-list-card-carousel.usecase';
import { RenderRoomItemCardsCarouselUseCase } from './usecases/render-room-item-cards-carousel/render-room-item-cards-carousel.usecase';
import { UseAuthBlockUseCase } from './usecases/use-auth-block/use-auth-block.usecase';
import { PluginRepo } from './infra/repos/plugin.repo';
import { KakaoChatbotAuthController } from './controllers/kakao-chatbot-auth.controller';
import { ParseSyncOtpParamPipe } from './pipes/parse-sync-otp-param.pipe';
import { AuthModule } from '../auth';
import { MembershipModule } from '../membership';
import { AuthExceptionFilter } from './exception-filters/auth-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { RenderAvailableSeatsListCardsCarouselUseCase } from './usecases/render-available-seats-list-cards-carousel/render-available-seats-list-cards-carousel.usecase';
import { PaymentModule } from '../payment/payment.module';
import { TemplateVirtualAccountUseCase } from './usecases/template-virtual-account-issuance-simple-text/template-virtual-account-issuance-simple-text.usecase';
import { KakaoChatbotSeatManagementController } from './controllers/kakao-chatbot-seat-management.controller';

const Repos = [PluginRepo];

const UseCases = [
  UseAuthBlockUseCase,
  RenderTicketCollectionListCardCarouselUseCase,
  RenderTicketCommerceCardsCarouselUseCase,
  RenderRoomItemCardsCarouselUseCase,
  RenderAvailableSeatsListCardsCarouselUseCase,
  TemplateVirtualAccountUseCase,
];

const Pipes = [ParseTicketTypeParamPipe, ParseSyncOtpParamPipe];

@Module({
  imports: [
    TicketModule,
    SeatManagementModule,
    AuthModule,
    MembershipModule,
    PaymentModule,
  ],
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

    ...Repos,
    ...UseCases,
    ...Pipes,
  ],
  exports: [],
})
export class KakaoChatbotModule {}
