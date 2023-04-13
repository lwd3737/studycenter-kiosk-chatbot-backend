import { IRepo } from 'src/core/domain/repo.interface';
import { MemberId } from './member-id';
import { Member } from './member.aggregate-root';

export const MemberRepoProvider = Symbol('MemberRepoProvider');

export interface IMemberRepo extends IRepo<Member> {
  existByAppUserId(appUserId: string): Promise<boolean>;
  create(member: Member): Promise<void>;
}
