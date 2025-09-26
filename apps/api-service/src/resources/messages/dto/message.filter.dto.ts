import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { CommonFilterSchema } from "@/common/schemas";

export const MessagesFilterSchema = CommonFilterSchema.extend({
  chatId: z.string().uuid("Invalid chat ID format"),
});

export class MessagesFilterDto extends createZodDto(MessagesFilterSchema) {}
