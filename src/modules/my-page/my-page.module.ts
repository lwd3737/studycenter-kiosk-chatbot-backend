import { Module, forwardRef } from '@nestjs/common';
import { MyTicketRepoProvider } from './domain/my-ticket/IMy-ticket.repo';
import { MockMyTicketRepo } from './infra/repos/mock/mock-my-ticket.repo';
import { CheckInOutService } from './application/services/check-in-out.service';
import { MyTicketService } from './application/services/my-ticket.service';
import { KakaoChatbotModule } from '../kakao-chatbot/kakao-chatbot.module';

@Module({
  imports: [forwardRef(() => KakaoChatbotModule)],
  providers: [
    {
      provide: MyTicketRepoProvider,
      useClass: MockMyTicketRepo,
    },

    MyTicketService,
    CheckInOutService,
  ],
  exports: [MyTicketService, CheckInOutService],
})
export class MyPageModule {}
