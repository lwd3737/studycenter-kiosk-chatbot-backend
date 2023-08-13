import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepo,
  MemberRepoProvider,
} from '../../domain/member/member.repo.interface';
import { Member } from '../../domain/member/member.aggregate-root';
import { Result, err, ok } from 'src/core';
import {
  MemberNotFoundByAppUserIdError,
  MemberNotFoundByIdError,
} from './member.error';

@Injectable()
export class MemberService {
  constructor(@Inject(MemberRepoProvider) private memberRepo: IMemberRepo) {}

  public async findById(
    id: string,
  ): Promise<Result<Member, MemberNotFoundByIdError>> {
    const found = await this.memberRepo.getById(id);
    if (!found) return err(new MemberNotFoundByIdError(id));
    return ok(found);
  }

  public async findByAppUserId(
    appUserId: string,
  ): Promise<Result<Member, MemberNotFoundByAppUserIdError>> {
    const found = await this.memberRepo.getByAppUserId(appUserId);
    if (!found) return err(new MemberNotFoundByAppUserIdError(appUserId));
    return ok(found);
  }
}
