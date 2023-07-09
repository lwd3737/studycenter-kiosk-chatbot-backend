import { Module } from '@nestjs/common';
import { MemberRepoProvider } from './domain/member/member.repo.interface';
import { MockMemberMapper } from './infra/mappers/impl/mocks/mock-member.mapper';
import { MemberMapperProvider } from './infra/mappers/member.mapper.interface';
import { MockMemberRepo } from './infra/repos/mocks/mock-member.repo';
import { GetMemberUseCase } from './application/usecases/get-member.usecase';

@Module({
  providers: [
    {
      provide: MemberRepoProvider,
      useClass: MockMemberRepo,
    },
    {
      provide: MemberMapperProvider,
      useClass: MockMemberMapper,
    },
    GetMemberUseCase,
  ],
  exports: [MemberRepoProvider, GetMemberUseCase],
})
export class MembershipModule {}
