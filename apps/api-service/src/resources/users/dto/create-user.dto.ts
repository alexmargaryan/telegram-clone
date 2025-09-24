import { createZodDto } from "nestjs-zod";
import z from "zod";

import { EmailSchema, NameSchema } from "@/common/schemas";

export const CreateUserSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  password: z.string(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
