import { Member } from 'src/modules/member/domain/member/member.ar';
import { MockMember } from '../repos/mock-member.repo';

export class MockMemberMapper {
  static toPersistence(member: Member): MockMember {
    return {
      id: member.id.value,
      appUserId: member.appUserId,
      nickName: member.nickName,
      phoneNumber: member.phoneNumber,
      email: member.email,
      profileImageUrl: member.profileImageUrl,
    };
  }

  static toDomain(raw: MockMember): Member {
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
