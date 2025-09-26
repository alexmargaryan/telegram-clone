import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const AddMemberSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});

export class AddMemberDto extends createZodDto(AddMemberSchema) {}
