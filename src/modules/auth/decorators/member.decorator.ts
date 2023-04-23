import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Member = createParamDecorator<string>(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const member = req.member;
    return data ? member?.[data] : member;
  },
);
