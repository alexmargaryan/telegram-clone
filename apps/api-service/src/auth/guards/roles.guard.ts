import { ForbiddenException } from "@/common/errors";
import { Role } from "@telegram-clone/database";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.getResourceRoles(context);

    if (!roles) return true;

    const user = this.getUserFromAuthenticatedRequest(context);

    return this.shouldMatchRoles(user.role, roles);
  }

  private getResourceRoles(context: ExecutionContext): Role[] {
    return this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getUserFromAuthenticatedRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.user;
  }

  private shouldMatchRoles(userRole: Role, acceptableRoles: Role[]): boolean {
    if (!this.isRoleMatched(userRole, acceptableRoles)) {
      throw new ForbiddenException("Permission denied");
    }

    return true;
  }

  private isRoleMatched(userRole: Role, methodRoles: Role[]): boolean {
    return methodRoles.includes(userRole);
  }
}
