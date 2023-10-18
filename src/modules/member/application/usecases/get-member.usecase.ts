import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, IUseCase, Result, err, ok } from 'src/core';
import {
  IMemberRepo,
  MemberRepoProvider,
} from '../../domain/member/IMember.repo';
import { Member } from '../../domain/member/member.ar';
import { GetMemberError, GetMemberErrors } from './get-member.error';

type UseCaseInput =
  | {
      appUserId: string;
    }
  | {
      memberId: string;
    };
type UseCaseResult = Result<Member, GetMemberError>;

@Injectable()
export class GetMemberUseCase implements IUseCase<UseCaseInput, UseCaseResult> {
  constructor(
    @Inject(MemberRepoProvider) private readonly memberRepo: IMemberRepo,
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const foundMember =
        'appUserId' in input
          ? await this.memberRepo.getByAppUserId(input.appUserId)
          : await this.memberRepo.getById(input.memberId);
      if (foundMember === null)
        return err(
          new GetMemberErrors.NotFound(this.getMemberIdOrAppUserId(input)),
        );

      return ok(foundMember);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }

  private getMemberIdOrAppUserId(input: UseCaseInput): string {
    return 'appUserId' in input ? input.appUserId : input.memberId;
  }
}
