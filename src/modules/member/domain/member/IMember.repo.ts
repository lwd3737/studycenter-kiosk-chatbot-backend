import { Member } from './member.ar';

export abstract class IMemberRepo {
  abstract create(member: Member): Promise<Member>;
  abstract existByAppUserId(appUserId: string): Promise<boolean>;
  abstract getById(id: string): Promise<Member | null>;
  abstract getByAppUserId(appUserId: string): Promise<Member | null>;
}
