import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateRateDto {
  @IsNumber()
  @IsNotEmpty()
  purchasePrice: number;

  @IsNumber()
  @IsNotEmpty()
  salePrice: number;
}
