import { Injectable } from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

@Injectable()
export class RatesService {

  private rates = [
    {
      id: '1',
      currencyPair: 'USDPEN',
      purchasePrice: 3.7,
      salePrice: 3.8,
    },
  ];

  create(createRateDto: CreateRateDto) {
    this.rates.push({
      id: (this.rates.length + 1).toString(),
      ...createRateDto,
    });
  }

  findAll() {
    return this.rates;
  }

  findOne(id: string) {
    return this.rates.find((rate) => rate.id === id);
  }

  update(id: string, updateRateDto: UpdateRateDto) {
    const index = this.rates.findIndex((rate) => rate.id === id);
    this.rates[index] = {
      ...this.rates[index],
      ...updateRateDto,
    };
  }
}
