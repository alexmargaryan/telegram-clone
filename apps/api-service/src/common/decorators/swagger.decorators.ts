import { zodToOpenAPI } from "nestjs-zod";
import { ZodObject } from "zod";

import { Type, applyDecorators } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from "@nestjs/swagger";

import { PaginatedDto } from "../dtos";

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto, model),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        required: ["data", "page", "pageSize", "total"],
        properties: {
          data: {
            type: "array",
            items: { $ref: getSchemaPath(model) },
          },
          page: { type: "number" },
          pageSize: { type: "number" },
          total: { type: "number" },
        },
      },
    })
  );
};

export const ApiQueryAll = (zodObject: ZodObject<any>) => {
  const openApi = zodToOpenAPI(zodObject);
  const decorators: MethodDecorator[] = [];
  if (typeof openApi.properties === "object") {
    Object.entries(openApi.properties).forEach(([key, value]) => {
      decorators.push(
        ApiQuery({
          name: key,
          schema: value,
          required: (openApi.required ?? []).includes(key),
          description: "description" in value ? value.description : "",
        })
      );
    });
  }
  return applyDecorators(...decorators);
};
