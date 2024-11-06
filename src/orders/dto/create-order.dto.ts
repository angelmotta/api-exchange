import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['compra', 'venta'])
  tipo_cambio: string;

  @IsNotEmpty()
  @IsNumber()
  monto_enviar: number;
}
