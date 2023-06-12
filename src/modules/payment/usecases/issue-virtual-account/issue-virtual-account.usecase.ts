import { Injectable } from '@nestjs/common';
import { IUseCase, Result } from 'src/core';

type UseCaseInput = {
  test?: string;
};

type UseCaseResult = Result<any>;

@Injectable()
export class IssueVirtualAccount
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  async execute(request: UseCaseInput): Promise<UseCaseResult> {
    throw new Error('Method not implemented.');
  }
}
