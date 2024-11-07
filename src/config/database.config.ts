import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getDatabaseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => {
  const uri = configService.get<string>('MONGODB_URI');
  const dbName = configService.get<string>('MONGODB_DB_NAME');

  return {
    uri,
    dbName,
  };
};
