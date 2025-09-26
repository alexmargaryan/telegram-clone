import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { DateSchema, GetPaginatedResponseSchema } from "@/common/schemas";
import { Role } from "@telegram-clone/database";

export const UserResponseSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

const UsersResponseSchema = GetPaginatedResponseSchema(UserResponseSchema);

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
export class UsersResponseDto extends createZodDto(UsersResponseSchema) {}
