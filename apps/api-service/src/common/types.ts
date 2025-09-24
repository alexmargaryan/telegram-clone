import * as zod from "zod";

import { MultiFieldSortItemSchema, PaginationSchema } from "./schemas";

export type Pagination = zod.infer<typeof PaginationSchema>;

export type Sorting = zod.infer<typeof MultiFieldSortItemSchema>;
