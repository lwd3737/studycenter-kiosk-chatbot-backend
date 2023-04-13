import { Injectable } from '@nestjs/common';
import { Member } from 'src/modules/membership/domain/member/member.aggregate-root';
import { MockMember } from '../../../repos/mocks/mock-member.repo';
import { IMemberMapper } from '../../member.mapper.interface';

@Injectable()
export class MockMemberMapper implements IMemberMapper {
  toPersistence(member: Member): MockMember {
    return {
      id: member.id.value,
      appUserId: member.appUserId,
      nickName: member.nickName,
      phoneNumber: member.phoneNumber,
      email: member.email,
      profileImageUrl: member.profileImageUrl,
    };
  }
}
