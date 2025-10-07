import { z } from "zod";

import { SigninSchema } from "./signinSchema";

export type SigninForm = z.infer<typeof SigninSchema>;
