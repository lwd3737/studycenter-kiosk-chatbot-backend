import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { IMemberRepo, MemberRepoProvider } from 'src/modules/membership';
import { Member } from 'src/modules/membership/domain/member/member.aggregate-root';
import { SignupError, SignupErrors } from './signup.erorr';

type UseCaseInput = {
  profile: {
    nickname?: string;
    profile_image_url?: string;
    phone_number?: string;
    email?: string;
    app_user_id: string;
  };
};

type UseCaseResult = Result<null, SignupError>;

@Injectable()
export class SignupUseCase implements IUseCase<UseCaseInput, UseCaseResult> {
  constructor(@Inject(MemberRepoProvider) private memberRepo: IMemberRepo) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    const { profile } = input;

    const isMemberAlreadyExist = await this.memberRepo.existByAppUserId(
      profile.app_user_id,
    );
    if (isMemberAlreadyExist) {
      return err(new SignupErrors.AlreadySignedupError());
    }

    const memberResult = Member.create({
      nickName: profile.nickname,
      profileImageUrl: profile.profile_image_url,
      phoneNumber: profile.phone_number,
      email: profile.email,
      appUserId: profile.app_user_id,
    });
    if (memberResult.isErr()) {
      return err(memberResult.error);
    }

    try {
      await this.memberRepo.create(memberResult.value);

      return ok(null);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error as Error));
    }
  }
}
