import { Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { AuthenticateUseCase, SignupUseCase } from 'src/modules/auth';
import { PluginRepo } from '../../infra/repos/plugin.repo';
import { SyncOtp } from '../../pipes/parse-sync-otp-param.pipe';
import { UseAuthBlockError, UseAuthBlockErrors } from './use-auth-block.error';

type UseCaseResult = Result<null, UseAuthBlockError>;

@Injectable()
export class UseAuthBlockUseCase implements IUseCase<SyncOtp, UseCaseResult> {
  constructor(
    private pluginRepo: PluginRepo,
    private authenciateUseCase: AuthenticateUseCase,
    private signupUseCase: SignupUseCase,
  ) {}

  async execute(syncOtp: SyncOtp): Promise<UseCaseResult> {
    try {
      const authenticateResult = await this.authenciateUseCase.execute({
        appUserId: syncOtp.app_user_id,
      });
      if (authenticateResult.isErr()) {
        return err(authenticateResult.error);
      }

      const isAlreadyAuthenciated = authenticateResult.value;
      if (isAlreadyAuthenciated) {
        return err(new UseAuthBlockErrors.AlreadyAuthenticatedError());
      }

      const profile = await this.pluginRepo.getProfile(syncOtp.otp);

      const signupResult = await this.signupUseCase.execute({ profile });
      if (signupResult.isErr()) {
        return err(signupResult.error);
      }

      return ok(null);
    } catch (error) {
      console.debug(error);
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
