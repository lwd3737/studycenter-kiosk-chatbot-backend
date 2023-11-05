import { Injectable } from '@nestjs/common';
import { Member } from 'src/modules/member/domain/member/member.ar';
import { IMemberRepo } from 'src/modules/member/domain/member/IMember.repo';

import { MockMemberMapper } from '../mappers/mock-member.mapper';
import { RepoError } from 'src/core';

export type MockMember = {
  id: string;
  appUserId: string;
  nickName: string;
  phoneNumber?: string;
  email?: string;
  profileImageUrl?: string;
};

const ERROR_TYPE = 'MockMemberRepo';

@Injectable()
export class MockMemberRepo extends IMemberRepo {
  private storage: MockMember[] = [];

  constructor() {
    super();
  }

  public async create(member: Member): Promise<Member> {
    const raw = MockMemberMapper.toPersistence(member) as MockMember;
    this.storage.push(raw);

    const created = await this.getById(raw.id);
    if (!created) throw new RepoError(`[${ERROR_TYPE}] Member not created!`);

    return created;
  }

  public async existByAppUserId(appUserId: string): Promise<boolean> {
    return this.storage.some((raw) => raw.appUserId === appUserId);
  }

  public async getById(id: string): Promise<Member | null> {
    const found = this.storage.find((raw) => raw.id === id);
    if (found === undefined) return null;
    return MockMemberMapper.toDomain(found);
  }

  public async getByAppUserId(appUserId: string): Promise<Member | null> {
    const found = this.storage.find((raw) => raw.appUserId == appUserId);
    if (found === undefined) return null;

    return MockMemberMapper.toDomain(found);
  }
}
