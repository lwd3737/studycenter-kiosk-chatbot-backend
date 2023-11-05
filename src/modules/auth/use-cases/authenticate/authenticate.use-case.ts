import { Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { IMemberRepo } from 'src/modules/member';
import { AuthenticateError } from './authenticate.error';
import { Member } from 'src/modules/member/domain/member/member.ar';

type UseCaseInput = {
  appUserId: string;
};
type UseCaseResult = Result<Member | null, AuthenticateError>;

@Injectable()
export class AuthenticateUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(private memberRepo: IMemberRepo) {}
  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const member = await this.memberRepo.getByAppUserId(input.appUserId);

      return ok(member);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
