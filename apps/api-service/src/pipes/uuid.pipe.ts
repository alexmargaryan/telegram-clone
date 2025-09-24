import { z } from "zod";

import { BadRequestException } from "@/common/errors";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class UuidValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata): string {
    const schema = z.string().uuid();
    try {
      schema.parse(value);
      return value;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException("Validation failed: Invalid id");
    }
  }
}
