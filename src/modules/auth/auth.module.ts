import { Module } from '@nestjs/common';
import { MemberModule } from '../member';
import { AuthenticateUseCase } from './use-cases/authenticate/authenticate.use-case';
import { SignupUseCase } from './use-cases/signup/signup.use-case';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [MemberModule],
  providers: [
    AuthenticateUseCase,
    SignupUseCase,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthenticateUseCase, SignupUseCase],
})
export class AuthModule {}
