import { ZodSerializerInterceptor } from "nestjs-zod";

import { Logger, Module } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ApiConfigModule } from "./config/config.module";
import { GlobalValidationPipe } from "./pipes/global.pipe";
import { PrismaModule } from "./prisma/prisma.module";
import { ResourcesModule } from "./resources/resources.module";

@Module({
  imports: [
    ApiConfigModule,
    PrismaModule,
    AuthModule,
    PassportModule,
    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
