import { z } from "zod";

import { EmailSchema, PasswordSchema } from "@/lib/schemas";

export const SignupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(20, { message: "First name must be less than 20 characters" }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(20, { message: "Last name must be less than 20 characters" }),
  email: EmailSchema,
  password: PasswordSchema,
});
