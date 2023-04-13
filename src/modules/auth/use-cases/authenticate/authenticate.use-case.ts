import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { IMemberRepo, MemberRepoProvider } from 'src/modules/membership';

type UseCaseInput = {
  appUserId: string;
};

type UseCaseResult = Result<boolean, AppErrors.UnexpectedError>;

@Injectable()
export class AuthenticateUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(@Inject(MemberRepoProvider) private memberRepo: IMemberRepo) {}
  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const exist = await this.memberRepo.existByAppUserId(input.appUserId);
      return ok(exist);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
