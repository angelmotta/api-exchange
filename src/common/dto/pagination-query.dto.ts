import { Type } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationQueryDto {
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  page?: number = 0;

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  size?: number = 10;
}
