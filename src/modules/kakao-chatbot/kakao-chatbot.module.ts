import { Module, forwardRef } from '@nestjs/common';
import { SeatManagementModule } from 'src/modules/seat-management';
import { TicketModule } from 'src/modules/ticketing';
import { KakaoChatbotTicketingController } from './controllers/kakao-chatbot-ticketing.controller';
import { PluginRepo } from './infra/repos/plugin.repo';
import { UseAuthBlockUseCase } from './application/usecases/use-auth-block/use-auth-block.usecase';
import { GetTicketGroupsUseCase } from './application/usecases/get-ticket-groups/get-ticket-groups.usecase';
import { SelectTicketAndGetAllRoomsUseCase } from './application/usecases/select-ticket-and-get-all-rooms/select-ticket-and-get-all-rooms.usecase';
import { GetTicketGroupUseCase } from './application/usecases/get-ticket-group/get-ticket-group.usecase';
import { GetAvailableSeatsUseCase } from './application/usecases/get-available-seats/get-available-seats.usecase';
import { IssueVirtualAccountUseCase } from './application/usecases/issue-virtual-account/issue-virtual-account.usecase';
import { MemberModule } from '../member';
import { AuthModule } from '../auth';
import { PaymentModule } from '../payment/payment.module';
import { KakaoChatbotAuthController } from './controllers/kakao-chatbot-auth.controller';
import { APP_FILTER } from '@nestjs/core';
import { AuthExceptionFilter } from './application/exception-filters/auth-exception.filter';
import { EventApiService } from './application/services/event-api.service';
import { EventApiRepo } from './infra/repos/event-api.repo';
import { SelectSeatAndConfirmTicketPurchaseInfoUseCase } from './application/usecases/select-seat-and-confirm-ticket-purchase-info/select-seat-and-confirm-ticket-purchase-info.usecase';
import { MyPageModule } from '../my-page/my-page.module';

const Repos = [PluginRepo, EventApiRepo];
const Services = [EventApiService];
const UseCases = [
  UseAuthBlockUseCase,
  GetTicketGroupsUseCase,
  GetTicketGroupUseCase,
  SelectTicketAndGetAllRoomsUseCase,
  GetAvailableSeatsUseCase,
  SelectSeatAndConfirmTicketPurchaseInfoUseCase,
  IssueVirtualAccountUseCase,
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
  controllers: [KakaoChatbotTicketingController, KakaoChatbotAuthController],
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
