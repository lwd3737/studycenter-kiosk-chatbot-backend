import { IRepo } from 'src/core/domain/repo.interface';
import { Member } from './member.aggregate-root';

export const MemberRepoProvider = Symbol('MemberRepoProvider');

export interface IMemberRepo extends IRepo<Member> {
  create(member: Member): Promise<void>;
  existByAppUserId(appUserId: string): Promise<boolean>;
  getById(id: string): Promise<Member | null>;
  getByAppUserId(appUserId: string): Promise<Member | null>;
}
