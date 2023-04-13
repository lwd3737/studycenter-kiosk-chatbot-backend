import { Module } from '@nestjs/common';
import { MemberRepoProvider } from './domain/member/member.repo.interface';
import { MockMemberMapper } from './infra/mappers/impl/mocks/mock-member.mapper';
import { MemberMapperProvider } from './infra/mappers/member.mapper.interface';
import { MockMemberRepo } from './infra/repos/mocks/mock-member.repo';

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
  ],
  exports: [MemberRepoProvider],
})
export class MembershipModule {}
