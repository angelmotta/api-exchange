import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { getDatabaseConfig } from './config/database.config';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    OrdersModule,
    RatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
