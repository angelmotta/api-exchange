import { RateResponseDto } from "src/rates/dto/rate-response.dto";

export class CreatedOrderResponseDto {
  id: string;
  tipoCambio: string;
  montoEnviar: number;
  montoRecibir: number;
  rate: RateResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
