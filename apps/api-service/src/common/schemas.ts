import { z } from "zod";

import { passwordRegex } from "./regex";

export const NameSchema = z.string().trim().min(1).max(20);

export const EmailSchema = z.string().trim().email().toLowerCase();

export const PasswordSchema = z.string().regex(passwordRegex, {
  message:
    "Password must have at least 8 characters (1 uppercase, 1 lowercase, 1 number, and 1 special character)",
});

export const DateSchema = z.preprocess(
  (val) => (val as Date).toISOString(),
  z.string()
);

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const SortItemSchema = z.object({
  field: z.string(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const MultiFieldSortItemSchema = z.object({
  sort: z.array(SortItemSchema).optional(),
});

export const CommonFilterSchema = PaginationSchema.merge(
  MultiFieldSortItemSchema
).extend({
  search: z.string().optional(),
});

export const GetPaginatedResponseSchema = (dataSchema: z.ZodSchema<any>) =>
  z.object({
    data: z.array(dataSchema),
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
  });
