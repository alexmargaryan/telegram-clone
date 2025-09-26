import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { DateSchema, GetPaginatedResponseSchema } from "@/common/schemas";
import { ChatType } from "@telegram-clone/database";

export const ChatResponseSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(ChatType),
  name: z.string().nullable(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
  members: z.array(
    z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
      user: z.object({
        id: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
        username: z.string().nullable(),
        avatarUrl: z.string().nullable(),
      }),
    })
  ),
  lastMessage: z
    .object({
      id: z.string().uuid(),
      text: z.string().nullable(),
      type: z.string(),
      createdAt: DateSchema,
      sender: z.object({
        id: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
        username: z.string().nullable(),
        avatarUrl: z.string().nullable(),
      }),
    })
    .nullable(),
});

const ChatsResponseSchema = GetPaginatedResponseSchema(ChatResponseSchema);

export class ChatResponseDto extends createZodDto(ChatResponseSchema) {}
export class ChatsResponseDto extends createZodDto(ChatsResponseSchema) {}
