import { SetMetadata } from "@nestjs/common";
import { Role } from "@telegram-clone/database";

export const ROLES_KEY = "roles";
export const RestrictTo = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
