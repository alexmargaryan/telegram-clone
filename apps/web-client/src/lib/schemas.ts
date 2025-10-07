import { z } from "zod";

import { passwordRegex } from "./regex";

export const NameSchema = z.string().trim().min(1).max(20);

export const EmailSchema = z.string().trim().email().toLowerCase();

export const PasswordSchema = z.string().regex(passwordRegex, {
  message:
    "Password must have at least 8 characters (1 uppercase, 1 lowercase, 1 number, and 1 special character)",
});
