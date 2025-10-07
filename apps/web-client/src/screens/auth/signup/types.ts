import { z } from "zod";

import { SignupSchema } from "./signupSchema";

export type SignupForm = z.infer<typeof SignupSchema>;
