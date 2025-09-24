import { Request } from "express";

import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from "@nestjs/common";

import { MultiFieldSortItemSchema, PaginationSchema } from "../schemas";
import { Pagination } from "../types";

// Param decorator to extract and validate pagination params from request query
export const PaginationParams = createParamDecorator<
  keyof Pagination | undefined,
  ExecutionContext
>((data, ctx) => {
  const request: Request = ctx.switchToHttp().getRequest();

  const validation = PaginationSchema.safeParse(request.query);
  if (!validation.success) {
    throw new BadRequestException(validation.error.issues[0].message);
  }

  const result = validation.data;
  return typeof data === "undefined" ? result : result[data];
});

// Param decorator to extract and validate sorting params from request query
export type PaginationParams<
  Prop extends keyof Pagination | undefined = undefined,
> = Prop extends keyof Pagination ? Pagination[Prop] : Pagination;

export const SortingParams = createParamDecorator(
  (validParams: readonly string[] | undefined, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();

    const validation = MultiFieldSortItemSchema.safeParse(req.query);

    if (!validParams) {
      throw new BadRequestException("Valid params not provided");
    }

    if (!validation.success) {
      throw new BadRequestException("Invalid sorting params");
    }

    const result: SortingParams<typeof validParams> = {};

    for (const item of validation.data.sort ?? []) {
      if (!validParams.includes(item.field)) {
        throw new BadRequestException(`Invalid sort property "${item.field}"`);
      }
      result[item.field] = item.order;
    }
    return result;
  }
);

export type SortingParams<T extends readonly string[]> = Partial<
  Record<T[number], "asc" | "desc">
>;
