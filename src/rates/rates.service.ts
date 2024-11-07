import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rate } from './schemas/rates.schema';
import { Model } from 'mongoose';
import { isValidObjectId } from 'mongoose';

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
      // return HTTP 409 Conflict response
      throw new ConflictException(`Requested CurrencyPair ${requestCreateRateDto.currencyPair} already exists`);
    }

    // create new rate
    const createdRate = new this.rateModel(requestCreateRateDto);
    return (await createdRate.save()).toJSON();
  }

  async findAll() {
    return await this.rateModel.find();
  }

  async findOne(requestedId: string) {
    // Verify if requestedId is a valid ObjectId
    if (!isValidObjectId(requestedId)) {
      throw new BadRequestException(`Invalid requested currencyPair ID: ${requestedId}`);
    }

    const rate = await this.rateModel.findById(requestedId);
    if (!rate) {
      // return HTTP 404 Not Found response
      throw new NotFoundException(`Rate with ID ${requestedId} not found`);
    }

    return rate;
  }
  
  // Only used internally from orders service to find rate by currency pair name
  async findByCurrencyPair(requestedCurrencyPair: string): Promise<Rate> {
    const rate = await this.rateModel.findOne({ currencyPair: requestedCurrencyPair });
    return rate;
  }

  async update(requestedId: string, requestUpdateRateDto: UpdateRateDto) {
    // Validate ObjectId format first
    if (!isValidObjectId(requestedId)) {
      // return HTTP 400 Bad Request response
      throw new BadRequestException(`Invalid requested currencyPair ID: ${requestedId}`);
    }

    const updatedRate = await this.rateModel.findByIdAndUpdate(requestedId, requestUpdateRateDto, {
      new: true,
    });
    
    if (!updatedRate) {
      // return HTTP 404 Not Found response
      throw new NotFoundException(`Rate with ID ${requestedId} not found`);
    }

    return updatedRate;
  }
}
