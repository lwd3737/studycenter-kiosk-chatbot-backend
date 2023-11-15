import { Module, forwardRef } from '@nestjs/common';
import { SeatManagementModule } from 'src/modules/seat-management';
import { TicketModule } from 'src/modules/ticketing';
import { KakaoChatbotTicketingController } from './controllers/kakao-chatbot-ticketing.controller';
import { PluginRepo } from './infra/repos/plugin.repo';
import { UseAuthBlockUseCase } from './application/usecases/use-auth-block/use-auth-block.usecase';
import { GetAllRoomsUseCase } from './application/usecases/ticketing/get-all-rooms/get-all-rooms.usecase';
import { GetAvailableSeatsInRoomUseCase } from './application/usecases/ticketing/get-available-seats-in-room/get-available-seats-in-room.usecase';
import { MemberModule } from '../member';
import { AuthModule } from '../auth';
import { PaymentModule } from '../payment/payment.module';
import { KakaoChatbotAuthController } from './controllers/kakao-chatbot-auth.controller';
import { APP_FILTER } from '@nestjs/core';
import { AuthExceptionFilter } from './application/exception-filters/auth-exception.filter';
import { EventApiService } from './application/services/event-api.service';
import { EventApiRepo } from './infra/repos/event-api.repo';
import { MyPageModule } from '../my-page/my-page.module';
import { KakaoChatbotCheckInOutController } from './controllers/kakao-chatbot-check-in-out.controller';
import { GetTicketGroupsUseCase } from './application/usecases/ticketing/get-ticket-groups/get-ticket-groups.usecase';
import { GetTicketGroupUseCase } from './application/usecases/ticketing/get-ticket-group/get-ticket-group.usecase';
import { ConfirmTicketPurchaseInfoUseCase } from './application/usecases/ticketing/confirm-ticket-purchase-info/confirm-ticket-purchase-info.usecase';
import { IssueVirtualAccountUseCase } from './application/usecases/ticketing/issue-virtual-account/issue-virtual-account.usecase';
import { ParseAppUserIdParamPipe } from './application/pipes/parse-app-user-id-param.pipe';
import { checkInOutUseCases } from './application/usecases/check-in-out';

const Repos = [PluginRepo, EventApiRepo];
const PublicServices = [EventApiService];
const UseCases = [
  UseAuthBlockUseCase,
  GetTicketGroupsUseCase,
  GetTicketGroupUseCase,
  GetAllRoomsUseCase,
  GetAvailableSeatsInRoomUseCase,
  ConfirmTicketPurchaseInfoUseCase,
  IssueVirtualAccountUseCase,
  ...checkInOutUseCases,
];

@Module({
  imports: [
    TicketModule,
    SeatManagementModule,
    AuthModule,
    MemberModule,
    forwardRef(() => PaymentModule),
    forwardRef(() => MyPageModule),
  ],
  controllers: [
    KakaoChatbotTicketingController,
    KakaoChatbotAuthController,
    KakaoChatbotCheckInOutController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
    ParseAppUserIdParamPipe,
    ...Repos,
    ...PublicServices,
    ...UseCases,
  ],
  exports: [...PublicServices],
})
export class KakaoChatbotModule {}
