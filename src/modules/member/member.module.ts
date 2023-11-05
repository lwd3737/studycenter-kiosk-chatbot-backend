import { Module } from '@nestjs/common';
import { IMemberRepo } from './domain/member/IMember.repo';
import { MockMemberRepo } from './infra/repos/mock-member.repo';
import { GetMemberUseCase } from './application/usecases/get-member.usecase';
import { MockMemberSeederService } from './application/services/mock-member-seeder.service';
import { MemberService } from './application/services/member.service';
import { createProviderBasedOnDevMode } from 'src/shared/utils/provider-factory';

@Module({
  providers: [
    createProviderBasedOnDevMode(IMemberRepo, (devMode) =>
      devMode ? new MockMemberRepo() : new Error('MemberRepo not implemented!'),
    ),
    GetMemberUseCase,
    MockMemberSeederService,
    MemberService,
  ],
  exports: [
    IMemberRepo,
    GetMemberUseCase,
    MemberService,
    MockMemberSeederService,
  ],
})
export class MemberModule {}
