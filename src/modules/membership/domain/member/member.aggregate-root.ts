import { err, ok, Result } from 'src/core';
import { AggregateRoot } from 'src/core/domain';
import { MemberId } from './member-id';
import { MemberErrors } from './member.error';

export interface MemberProps {
  appUserId: string;
  nickName?: string;
  phoneNumber?: string;
  email?: string;
  profileImageUrl?: string;
}

export class Member extends AggregateRoot<MemberProps> {
  get memberId(): MemberId {
    return new MemberId(this.id.value);
  }

  get appUserId(): string {
    return this.props.appUserId;
  }

  get nickName(): string | undefined {
    return this.props.nickName;
  }

  get phoneNumber(): string | undefined {
    return this.props.phoneNumber;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get profileImageUrl(): string | undefined {
    return this.props.profileImageUrl;
  }

  public static create(
    props: MemberProps,
    id?: string,
  ): Result<Member, MemberErrors.PhoneNumberOrEmailNotIncludedError> {
    if (this.isPhoneNumberOrEmailNotIncluded(props)) {
      return err(new MemberErrors.PhoneNumberOrEmailNotIncludedError());
    }

    return ok(new Member(props, id));
  }

  private static isPhoneNumberOrEmailNotIncluded(
    props: Pick<MemberProps, 'email' | 'phoneNumber'>,
  ): boolean {
    return !props.email && !props.phoneNumber;
  }

  private constructor(props: MemberProps, id?: string) {
    super(props, id);
  }
}
