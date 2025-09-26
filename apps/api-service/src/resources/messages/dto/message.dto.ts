import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { DateSchema, GetPaginatedResponseSchema } from "@/common/schemas";
import { MessageType } from "@telegram-clone/database";

export const MessageResponseSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  senderId: z.string().uuid(),
  text: z.string().nullable(),
  type: z.nativeEnum(MessageType),
  mediaUrl: z.string().nullable(),
  replyToMessageId: z.string().uuid().nullable(),
  isDeleted: z.boolean(),
  isEdited: z.boolean(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
  sender: z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string().nullable(),
    avatarUrl: z.string().nullable(),
  }),
  replyToMessage: z
    .object({
      id: z.string().uuid(),
      text: z.string().nullable(),
      type: z.nativeEnum(MessageType),
      sender: z.object({
        id: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
        username: z.string().nullable(),
        avatarUrl: z.string().nullable(),
      }),
    })
    .nullable(),
  reactions: z.array(
    z.object({
      id: z.string().uuid(),
      emoji: z.string(),
      user: z.object({
        id: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
        username: z.string().nullable(),
        avatarUrl: z.string().nullable(),
      }),
    })
  ),
});

export const MessagesResponseSchema = GetPaginatedResponseSchema(
  MessageResponseSchema
);

export class MessageResponseDto extends createZodDto(MessageResponseSchema) {}
export class MessagesResponseDto extends createZodDto(MessagesResponseSchema) {}
