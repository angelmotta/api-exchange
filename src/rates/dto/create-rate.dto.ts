import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRateDto {
  @IsString()
  @IsNotEmpty()
  currencyPair: string;

  @IsNumber()
  @IsNotEmpty()
  purchasePrice: number;

  @IsNumber()
  @IsNotEmpty()
  salePrice: number;
}
