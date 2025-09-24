import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { EmailSchema, NameSchema, PasswordSchema } from "@/common/schemas";

export const SigninSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});

export const SignupSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});

export class SigninDto extends createZodDto(SigninSchema) {}
export class SignupDto extends createZodDto(SignupSchema) {}
