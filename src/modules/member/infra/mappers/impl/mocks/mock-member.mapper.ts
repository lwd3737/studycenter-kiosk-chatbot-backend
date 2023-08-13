import { Injectable } from '@nestjs/common';
import { Member } from 'src/modules/member/domain/member/member.aggregate-root';
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

  toDomain(raw: MockMember): Member {
    const memberResult = Member.create(
      {
        appUserId: raw.appUserId,
        nickName: raw.nickName,
        phoneNumber: raw.phoneNumber,
        email: raw.email,
        profileImageUrl: raw.profileImageUrl,
      },
      raw.id,
    );
    if (memberResult.isErr()) throw memberResult.error;

    return memberResult.value;
  }
}
