import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rate, RateSchema } from './schemas/rates.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rate.name, schema: RateSchema }
    ])
  ],
  controllers: [RatesController],
  providers: [RatesService],
  exports: [RatesService]
})
export class RatesModule {}
