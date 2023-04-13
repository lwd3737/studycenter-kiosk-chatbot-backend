import { IMapper } from 'src/core';
import { Member } from '../../domain/member/member.aggregate-root';

export const MemberMapperProvider = Symbol('MemberMapperProvider');

export interface IMemberMapper extends IMapper<Member> {
  toPersistence(member: Member): any;
}
