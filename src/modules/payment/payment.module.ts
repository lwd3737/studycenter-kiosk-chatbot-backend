import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PGRepo, PGRepoProvider } from './infra/repos/PG.repo';
import { IssueVirtualAccountUseCase } from './usecases/issue-virtual-account/issue-virtual-account.usecase';
import { MembershipModule } from '../membership';
import { TicketModule } from '../ticketing';

const repos = [
  {
    provide: PGRepoProvider,
    useClass: PGRepo,
  },
];

const usecases = [IssueVirtualAccountUseCase];

@Module({
  imports: [MembershipModule, TicketModule],
  controllers: [PaymentController],
  providers: [...repos, ...usecases],
  exports: [...usecases],
})
export class PaymentModule {}
