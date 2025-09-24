import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ApiConfigService } from "./config.service";
import { config } from "./environment";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: config,
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
