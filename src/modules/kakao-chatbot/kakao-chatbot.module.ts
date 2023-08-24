import { Module, forwardRef } from '@nestjs/common';
import { SeatManagementModule } from 'src/modules/seat-management';
import { TicketModule } from 'src/modules/ticketing';
import { KakaoChatbotTicketingController } from './controllers/kakao-chatbot-ticketing.controller';
import { KakaoChatbotSeatManagementController } from './controllers/kakao-chatbot-seat-management.controller';
import { PluginRepo } from './infra/repos/plugin.repo';
import { UseAuthBlockUseCase } from './application/usecases/use-auth-block/use-auth-block.usecase';
import { RenderTicketCollectionListCardCarouselUseCase } from './application/usecases/render-ticket-collection-list-card-carousel/render-ticket-collection-list-card-carousel.usecase';
import { RenderRoomItemCardsCarouselUseCase } from './application/usecases/render-room-item-cards-carousel/render-room-item-cards-carousel.usecase';
import { RenderTicketCommerceCardsCarouselUseCase } from './application/usecases/render-ticket-commerce-cards-carousel/render-ticket-commerce-cards-carousel.usecase';
import { RenderAvailableSeatsListCardsCarouselUseCase } from './application/usecases/render-available-seats-list-cards-carousel/render-available-seats-list-cards-carousel.usecase';
import { IssueVirtualAccountUseCase } from './application/usecases/issue-virtual-account/issue-virtual-account.usecase';
import { ParseTicketTypeParamPipe } from './application/pipes/parse-ticket-category-param.pipe';
import { ParseSyncOtpParamPipe } from './application/pipes/parse-sync-otp-param.pipe';
import { MembershipModule } from '../member';
import { AuthModule } from '../auth';
import { PaymentModule } from '../payment/payment.module';
import { KakaoChatbotAuthController } from './controllers/kakao-chatbot-auth.controller';
import { APP_FILTER } from '@nestjs/core';
import { AuthExceptionFilter } from './application/exception-filters/auth-exception.filter';
import { EventApiService } from './application/services/event-api.service';
import { EventApiRepo } from './infra/repos/event-api.repo';
import { ConfirmTicketPurchaseInfoUseCase } from './application/usecases/confirm-ticket-purchase-info/confirm-ticket-purchase-info.usecase';

const Repos = [PluginRepo, EventApiRepo];
const Services = [EventApiService];
const UseCases = [
  UseAuthBlockUseCase,
  RenderTicketCollectionListCardCarouselUseCase,
  RenderTicketCommerceCardsCarouselUseCase,
  RenderRoomItemCardsCarouselUseCase,
  RenderAvailableSeatsListCardsCarouselUseCase,
  ConfirmTicketPurchaseInfoUseCase,
  IssueVirtualAccountUseCase,
];

@Module({
  imports: [
    TicketModule,
    SeatManagementModule,
    AuthModule,
    MembershipModule,
    forwardRef(() => PaymentModule),
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
    ...Services,
    ...UseCases,
  ],
  exports: [...Services],
})
export class KakaoChatbotModule {}
