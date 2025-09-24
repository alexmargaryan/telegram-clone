import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { Role } from "@telegram-clone/database";

export const UserResponseSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  createdAt: z.preprocess((val) => (val as Date).toISOString(), z.string()),
  updatedAt: z.preprocess((val) => (val as Date).toISOString(), z.string()),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
