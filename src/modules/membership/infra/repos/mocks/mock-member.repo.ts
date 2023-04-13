import { Inject, Injectable } from '@nestjs/common';
import { Member } from 'src/modules/membership/domain/member/member.aggregate-root';
import { IMemberRepo } from 'src/modules/membership/domain/member/member.repo.interface';
import {
  IMemberMapper,
  MemberMapperProvider,
} from '../../mappers/member.mapper.interface';

export type MockMember = {
  id: string;
  appUserId: string;
  nickName?: string;
  phoneNumber?: string;
  email?: string;
  profileImageUrl?: string;
};

@Injectable()
export class MockMemberRepo implements IMemberRepo {
  private storage: MockMember[] = [];

  constructor(
    @Inject(MemberMapperProvider) private memberMapper: IMemberMapper,
  ) {}
  public async existByAppUserId(appUserId: string): Promise<boolean> {
    return this.storage.some((raw) => raw.appUserId === appUserId);
  }

  public async create(member: Member): Promise<void> {
    const raw = this.memberMapper.toPersistence(member) as MockMember;
    this.storage.push(raw);
  }
}
