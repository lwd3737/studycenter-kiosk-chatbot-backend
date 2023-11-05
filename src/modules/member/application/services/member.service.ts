import { Injectable } from '@nestjs/common';
import { IMemberRepo } from '../../domain/member/IMember.repo';
import { Member } from '../../domain/member/member.ar';

@Injectable()
export class MemberService {
  constructor(private memberRepo: IMemberRepo) {}

  public async findById(id: string): Promise<Member | null> {
    const found = await this.memberRepo.getById(id);
    if (!found) return null;
    return found;
  }

  public async findByAppUserId(appUserId: string): Promise<Member | null> {
    const found = await this.memberRepo.getByAppUserId(appUserId);
    if (!found) return null;
    return found;
  }
}
