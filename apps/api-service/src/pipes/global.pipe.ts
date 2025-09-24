import { validate, ZodValidationException } from "nestjs-zod";
import { ZodIssue, ZodSchema } from "zod";

import { BadRequestException } from "@/common/errors";
import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class GlobalValidationPipe implements PipeTransform {
  transform(value: unknown, { type, metatype }: ArgumentMetadata) {
    if (type === "custom") return value;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    try {
      const parsedValue = validate(value, metatype as unknown as ZodSchema);
      return parsedValue;
    } catch (error: unknown) {
      const errors = (error as ZodValidationException).getZodError().errors;

      throw new BadRequestException(this.formatErrors(errors));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ZodIssue[]): string {
    const message = errors[0]?.message;
    const path = errors[0]?.path;

    if (message == undefined || path == undefined) {
      return "Validation failed";
    }

    return `${message} at field "${path.join(".")}"`;
  }
}
