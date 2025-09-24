import { ApiProperty } from "@nestjs/swagger";

export class PaginatedDto<TData> {
  @ApiProperty()
  data: TData[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  total: number;
}
