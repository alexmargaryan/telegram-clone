import { Module } from "@nestjs/common";

import { JwtModule } from "../jwt/jwt.module";
import { JwtTokenService } from "./jwt-token.service";

@Module({
  imports: [JwtModule],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtTokenModule {}
