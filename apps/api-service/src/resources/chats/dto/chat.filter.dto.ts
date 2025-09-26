import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { CommonFilterSchema } from "@/common/schemas";
import { ChatType } from "@telegram-clone/database";

export const ChatsFilterSchema = CommonFilterSchema.extend({
  type: z.nativeEnum(ChatType).optional(),
});

export class ChatsFilterDto extends createZodDto(ChatsFilterSchema) {}
