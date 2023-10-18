import { IMapper } from 'src/core';
import { Member } from '../../domain/member/member.ar';

export const MemberMapperProvider = Symbol('MemberMapperProvider');

export interface IMemberMapper extends IMapper<Member> {
  toPersistence(member: Member): any;
  toDomain(raw: any): Member;
}
