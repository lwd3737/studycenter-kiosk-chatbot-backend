import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PGRepo, PGRepoProvider } from './infra/repos/PG.repo';
import { MembershipModule } from '../member';
import { TicketModule } from '../ticketing';
import { PaymentRepoProvider } from './domain/payment/IPayment.repo';
import { MockPaymentRepo } from './infra/repos/mocks/mock-payment.repo';
import { PaymentService } from './application/services/payment.service';
import { DepositCallbackUseCase } from './application/usecases/deposit-callback/deposit-callback.usecase';
import { KakaoChatbotModule } from '../kakao-chatbot';

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
    MembershipModule,
    TicketModule,
    forwardRef(() => KakaoChatbotModule),
  ],
  controllers: [PaymentController],
  providers: [...repos, ...services, ...usecases],
  exports: [...usecases, ...services],
})
export class PaymentModule {}
