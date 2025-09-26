import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UpdateMessageSchema = z
  .object({
    text: z.string().trim().min(1).max(4000).optional(),
    mediaUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      if (data.text && data.mediaUrl) {
        return false;
      }

      if (data.text) {
        return data.text.trim().length > 0;
      }

      return data.mediaUrl !== undefined && data.mediaUrl.trim().length > 0;
    },
    {
      message: "Either text or media URL is required, not both",
    }
  );

export class UpdateMessageDto extends createZodDto(UpdateMessageSchema) {}
