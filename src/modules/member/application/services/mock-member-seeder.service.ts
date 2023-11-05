import { Injectable } from '@nestjs/common';
import { IMemberRepo } from '../../domain/member/IMember.repo';
import { Member } from '../../domain/member/member.ar';
import { CustomConfigService } from 'src/modules/config';

@Injectable()
export class MockMemberSeederService {
  private appUserId: string;

  constructor(
    private configService: CustomConfigService,
    private memberRepo: IMemberRepo,
  ) {
    this.appUserId = this.configService.get('kakao.test.appUserId', {
      infer: true,
    })!;
  }

  public async execute() {
    const created = await this.seed();
    console.info(`Mock Member seeding successfully`);
    return created;
  }

  public async seed() {
    const member = Member.create({
      appUserId: this.appUserId,
      nickName: 'testNickName',
      phoneNumber: '010111122222',
      email: 'test@test.com',
    });
    if (member.isErr())
      throw Error(`Member Test util service Error: ${member.error.message}`);

    return await this.memberRepo.create(member.value);
  }
}
