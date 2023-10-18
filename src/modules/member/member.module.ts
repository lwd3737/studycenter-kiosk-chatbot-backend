import { Module } from '@nestjs/common';
import { MemberRepoProvider } from './domain/member/IMember.repo';
import { MockMemberMapper } from './infra/mappers/impl/mocks/mock-member.mapper';
import { MemberMapperProvider } from './infra/mappers/member.mapper.interface';
import { MockMemberRepo } from './infra/repos/mocks/mock-member.repo';
import { GetMemberUseCase } from './application/usecases/get-member.usecase';
import { MemberTestSeederService } from './application/__test__/member-test-seeder.service';
import { MemberService } from './application/services/member.service';

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
    MemberTestSeederService,
    MemberService,
  ],
  exports: [MemberRepoProvider, GetMemberUseCase, MemberService],
})
export class MemberModule {}
