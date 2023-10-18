import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PGRepo, PGRepoProvider } from './infra/repos/PG.repo';
import { MemberModule } from '../member';
import { TicketModule } from '../ticketing';
import { PaymentRepoProvider } from './domain/payment/IPayment.repo';
import { MockPaymentRepo } from './infra/repos/mocks/mock-payment.repo';
import { PaymentService } from './application/services/payment.service';
import { DepositCallbackUseCase } from './application/usecases/deposit-callback/deposit-callback.usecase';
import { KakaoChatbotModule } from '../kakao-chatbot';
import { SeatManagementModule } from '../seat-management';
import { MyPageModule } from '../my-page/my-page.module';

const repos = [
  {
    provide: PGRepoProvider,
    useClass: PGRepo,
  },
  {
    provide: PaymentRepoProvider,
    useClass: MockPaymentRepo,
  },
];
const services = [PaymentService];
const usecases = [DepositCallbackUseCase];

@Module({
  imports: [
    MemberModule,
    TicketModule,
    SeatManagementModule,
    forwardRef(() => KakaoChatbotModule),
    MyPageModule,
  ],
  controllers: [PaymentController],
  providers: [...repos, ...services, ...usecases],
  exports: [...usecases, ...services],
})
export class PaymentModule {}
