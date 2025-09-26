import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const StartPrivateChatSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});

export class StartPrivateChatDto extends createZodDto(StartPrivateChatSchema) {}
