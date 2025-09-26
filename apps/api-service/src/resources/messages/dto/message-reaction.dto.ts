import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { DateSchema } from "@/common/schemas";

export const MessageReactionSchema = z.object({
  emoji: z.string().min(1, "Emoji is required").max(10, "Emoji is too long"),
});

export const MessageReactionsResponseSchema = z.object({
  id: z.string().uuid(),
  emoji: z.string(),
  createdAt: DateSchema,
  messageId: z.string().uuid(),
  userId: z.string().uuid(),
  user: z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string().nullable(),
    avatarUrl: z.string().nullable(),
  }),
});

export class MessageReactionDto extends createZodDto(MessageReactionSchema) {}
export class MessageReactionsResponseDto extends createZodDto(
  MessageReactionsResponseSchema
) {}
