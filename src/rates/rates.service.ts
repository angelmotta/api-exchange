import { ConflictException, Injectable } from '@nestjs/common';
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

  async create(requestCreateRateDto: CreateRateDto) {
    // check if currencyPair already exists
    const existingRate = await this.rateModel.findOne({
      currencyPair: requestCreateRateDto.currencyPair,
    });
    if (existingRate) {
      throw new ConflictException(`Requested Currency pair ${requestCreateRateDto.currencyPair} already exists`);
    }

    // create new rate
    const createdRate = new this.rateModel(requestCreateRateDto);
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
