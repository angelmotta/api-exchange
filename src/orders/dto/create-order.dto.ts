import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['compra', 'venta'])
  tipoCambio: string;

  @IsNotEmpty()
  @IsNumber()
  montoEnviar: number;
}
