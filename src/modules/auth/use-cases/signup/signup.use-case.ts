import { Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { IMemberRepo } from 'src/modules/member';
import { Member } from 'src/modules/member/domain/member/member.ar';
import { SignupError, SignupErrors } from './signup.erorr';

type UseCaseInput = {
  profile: {
    nickname: string;
    profile_image_url?: string;
    phone_number?: string;
    email?: string;
    app_user_id: string;
  };
};

type UseCaseResult = Result<null, SignupError>;

@Injectable()
export class SignupUseCase implements IUseCase<UseCaseInput, UseCaseResult> {
  constructor(private memberRepo: IMemberRepo) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    const { profile } = input;

    const isMemberAlreadyExist = await this.memberRepo.existByAppUserId(
      profile.app_user_id,
    );
    if (isMemberAlreadyExist) {
      return err(new SignupErrors.AlreadySignedupError());
    }

    const memberOrError = Member.create({
      nickName: profile.nickname,
      profileImageUrl: profile.profile_image_url,
      phoneNumber: profile.phone_number,
      email: profile.email,
      appUserId: profile.app_user_id,
    });
    if (memberOrError.isErr()) {
      return err(memberOrError.error);
    }

    try {
      await this.memberRepo.create(memberOrError.value);

      return ok(null);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error as Error));
    }
  }
}
