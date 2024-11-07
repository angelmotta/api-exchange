import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

export const envConfig: ConfigModuleOptions = {
  envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'], // load .env file based on NODE_ENV
  ignoreEnvFile: process.env.NODE_ENV === 'production', // ignore .env file in production
  // Environment schema validation
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number().default(3000),
    MONGODB_URI: Joi.string().required(),
    MONGODB_DB_NAME: Joi.string().required(),
  }),
  validationOptions: {
    abortEarly: true, // stop validation on first error
    allowUnknown: true, // allow unknown keys that will be ignored
  },
};
