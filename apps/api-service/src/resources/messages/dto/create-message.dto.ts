import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { MessageType } from "@telegram-clone/database";

export const CreateMessageSchema = z
  .object({
    chatId: z.string().uuid("Invalid chat ID format"),
    text: z.string().trim().min(1).max(4000).optional(),
    type: z.nativeEnum(MessageType).default(MessageType.TEXT),
    mediaUrl: z.string().url().optional(),
    replyToMessageId: z
      .string()
      .uuid("Invalid reply message ID format")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.text && data.mediaUrl) {
        return false;
      }

      if (data.type === MessageType.TEXT) {
        return data.text !== undefined && data.text.trim().length > 0;
      }

      return data.mediaUrl !== undefined && data.mediaUrl.trim().length > 0;
    },
    {
      message: "Text or media URL is required",
    }
  );

export class CreateMessageDto extends createZodDto(CreateMessageSchema) {}
