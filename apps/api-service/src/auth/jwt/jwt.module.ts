import { ApiConfigModule } from "@/config/config.module";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";

import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtConfigService } from "./jwt-config.service";

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ApiConfigModule],
      useClass: JwtConfigService,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [NestJwtModule],
})
export class JwtModule {}
