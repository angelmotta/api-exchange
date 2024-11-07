import { IsIn, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateRateDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['USDPEN'])
  currencyPair: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  purchasePrice: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  salePrice: number;
}
