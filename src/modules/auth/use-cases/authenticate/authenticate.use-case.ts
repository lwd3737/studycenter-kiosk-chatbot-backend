import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { IMemberRepo, MemberRepoProvider } from 'src/modules/member';
import { AuthenticateError, AuthenticateErrors } from './authenticate.error';
import { Member } from 'src/modules/member/domain/member/member.ar';

type UseCaseInput = {
  appUserId: string;
};

type UseCaseResult = Result<Member | null, AuthenticateError>;

@Injectable()
export class AuthenticateUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(@Inject(MemberRepoProvider) private memberRepo: IMemberRepo) {}
  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const member = await this.memberRepo.getByAppUserId(input.appUserId);

      return ok(member);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
