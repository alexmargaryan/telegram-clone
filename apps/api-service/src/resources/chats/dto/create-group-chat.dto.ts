import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateGroupChatSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Chat name is required")
    .max(100, "Chat name too long"),
});

export class CreateGroupChatDto extends createZodDto(CreateGroupChatSchema) {}
