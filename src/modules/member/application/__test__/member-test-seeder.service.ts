import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  IMemberRepo,
  MemberRepoProvider,
} from '../../domain/member/member.repo.interface';
import { Member } from '../../domain/member/member.aggregate-root';

@Injectable()
export class MemberTestSeederService implements OnApplicationBootstrap {
  constructor(@Inject(MemberRepoProvider) private memberRepo: IMemberRepo) {}
  async onApplicationBootstrap() {
    await this.createMember();
  }

  public async createMember() {
    const appUserId = process.env.APP_USER_ID_FOR_TEST!;

    const member = Member.create({
      appUserId,
      nickName: 'testNickName',
      phoneNumber: '010111122222',
      email: 'test@test.com',
    });
    if (member.isErr())
      throw Error(`Member Test util service Error: ${member.error.message}`);

    await this.memberRepo.create(member.value);
  }
}
