import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';

import validateConfig from '../../core/utils/validate-config';
import { StripeConfig } from './stripe-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  STRIPE_API_KEY!: string;

  @IsString()
  @IsOptional()
  STRIPE_SECRET_KEY!: string;

  @IsString()
  @IsOptional()
  STRIPE_WEBHOOK_SECRET!: string;
}

export default registerAs<StripeConfig>('stripe', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.STRIPE_API_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  };
});
