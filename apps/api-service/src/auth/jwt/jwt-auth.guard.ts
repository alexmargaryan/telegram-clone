import { UnauthorizedException } from "@/common/errors";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

import {
  EXPIRED_TOKEN_ERROR_MESSAGE,
  EXPIRED_TOKEN_INFO_MESSAGE,
  INVALID_TOKEN_ERROR_MESSAGE,
} from "../auth.constants";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  override handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any
  ) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!user) {
      if (isPublic) {
        return user;
      }

      if (info && this.isTokenExpired(info)) {
        throw new UnauthorizedException(EXPIRED_TOKEN_ERROR_MESSAGE);
      }

      throw new UnauthorizedException(INVALID_TOKEN_ERROR_MESSAGE);
    }

    return super.handleRequest(err, user, info, context, status);
  }

  private isTokenExpired(info: { message: string }) {
    return info.message === EXPIRED_TOKEN_INFO_MESSAGE;
  }
}
