import { patchNestJsSwagger } from "nestjs-zod";

import { Logger } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { ApiConfigService } from "./config/config.service";
import { swaggerOptions } from "./config/swagger-options";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  const config = app.get(ApiConfigService);

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, app.get(Logger)));

  const swaggerConfig = new DocumentBuilder()
    .setTitle(swaggerOptions.title)
    .setDescription(swaggerOptions.description)
    .setVersion(swaggerOptions.version)
    .addBearerAuth()
    .build();

  patchNestJsSwagger();

  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, documentFactory);

  app.enableCors();

  await app.listen(config.port, () => {
    console.log(`App is listening on port ${config.port}`);
  });
}
bootstrap();
