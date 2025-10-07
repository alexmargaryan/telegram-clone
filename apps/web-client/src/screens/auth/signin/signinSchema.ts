import { z } from "zod";

import { EmailSchema } from "@/lib/schemas";

export const SigninSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});
