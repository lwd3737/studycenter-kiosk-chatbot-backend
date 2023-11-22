import { Module, forwardRef } from '@nestjs/common';
import { IMyTicketRepo } from './domain/my-ticket/IMy-ticket.repo';
import { MockMyTicketRepo } from './infra/repos/mock-my-ticket.repo';
import { CheckInOutService } from './application/services/check-in-out/service';
import { MyTicketService } from './application/services/my-ticket.service';
import { KakaoChatbotModule } from '../kakao-chatbot/kakao-chatbot.module';
import { MemberModule } from '../member';
import { createProviderBasedOnDevMode } from 'src/shared/utils/provider-factory';
import { SeatManagementModule } from '../seat-management';

@Module({
  imports: [
    forwardRef(() => KakaoChatbotModule),
    MemberModule,
    SeatManagementModule,
  ],
  providers: [
    createProviderBasedOnDevMode(IMyTicketRepo, (devMode) =>
      devMode
        ? new MockMyTicketRepo()
        : new Error('MyTicketRepo not implemented!'),
    ),

    MyTicketService,
    CheckInOutService,
  ],
  exports: [MyTicketService, CheckInOutService],
})
export class MyPageModule {}
