import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const TokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const AccessTokenSchema = TokenSchema.pick({ accessToken: true });

export class TokenDto extends createZodDto(TokenSchema) {}
export class AccessTokenDto extends createZodDto(AccessTokenSchema) {}
