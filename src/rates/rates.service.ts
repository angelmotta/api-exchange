import { Injectable } from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rate } from './schemas/rates.schema';
import { Model } from 'mongoose';

@Injectable()
export class RatesService {

  constructor(
    @InjectModel(Rate.name) private rateModel: Model<Rate>
  ) {}

  private rates = [
    {
      id: '1',
      currencyPair: 'USDPEN',
      purchasePrice: 3.7,
      salePrice: 3.8,
    },
  ];

  async create(createRateDto: CreateRateDto) {
    const createdRate = new this.rateModel(createRateDto);
    return (await createdRate.save()).toJSON();
  }

  async findAll() {
    return await this.rateModel.find();
  }

  async findOne(id: string) {
    return await this.rateModel.findById(id);
  }

  async update(id: string, updateRateDto: UpdateRateDto) {
    return await this.rateModel.findByIdAndUpdate(id, updateRateDto, {
      new: true,
    });
  }
}
