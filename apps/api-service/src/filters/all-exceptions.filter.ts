import { ZodSerializationException } from "nestjs-zod";

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const isHttpException = exception instanceof HttpException;

    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = (isHttpException ? exception.getResponse() : {}) as {
      type?: string;
    };

    if (exception instanceof HttpException) {
      this.logger.log({
        level: "error",
        status: httpStatus,
        message: exception.message,
        stack: exception.stack,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      });
    } else if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();
      this.logger.log({
        level: "error",
        message: zodError.message,
        stack: exception.stack,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      });
    } else {
      this.logger.log({
        level: "error",
        status: httpStatus,
        message: "Internal Server Error",
        stack: exception instanceof Error ? exception.stack : exception,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      });
    }

    const responseBody = {
      statusCode: httpStatus,
      type: response.type,
      message: isHttpException ? exception.message : "Internal Server Error",
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
