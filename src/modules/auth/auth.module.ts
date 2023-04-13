import { Module } from '@nestjs/common';
import { MembershipModule } from '../membership';
import { AuthenticateUseCase } from './use-cases/authenticate/authenticate.use-case';
import { SignupUseCase } from './use-cases/signup/signup.use-case';

@Module({
  imports: [MembershipModule],
  providers: [AuthenticateUseCase, SignupUseCase],
  exports: [AuthenticateUseCase, SignupUseCase],
})
export class AuthModule {}
