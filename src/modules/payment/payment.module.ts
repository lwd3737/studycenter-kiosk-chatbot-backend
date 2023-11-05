import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PGRepo, PGRepoProvider } from './infra/repos/PG.repo';
import { MemberModule } from '../member';
import { TicketModule } from '../ticketing';
import { IPaymentRepo } from './domain/payment/IPayment.repo';
import { MockPaymentRepo } from './infra/repos/mock-payment.repo';
import { PaymentService } from './application/services/payment.service';
import { DepositCallbackUseCase } from './application/usecases/deposit-callback/deposit-callback.usecase';
import { KakaoChatbotModule } from '../kakao-chatbot';
import { SeatManagementModule } from '../seat-management';
import { MyPageModule } from '../my-page/my-page.module';
import { MockPaymentCompletionService } from './application/services/mock-payment-completion.service';
import { PaymentRepo } from './infra/repos/payment.repo';
import { createProviderBasedOnDevMode } from 'src/shared/utils/provider-factory';

const repos = [
  {
    provide: PGRepoProvider,
    useClass: PGRepo,
  },
  createProviderBasedOnDevMode(IPaymentRepo, (devMode) =>
    devMode ? new MockPaymentRepo() : new PaymentRepo(),
  ),
];
const services = [PaymentService, MockPaymentCompletionService];
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
  exports: [...services],
})
export class PaymentModule {}
