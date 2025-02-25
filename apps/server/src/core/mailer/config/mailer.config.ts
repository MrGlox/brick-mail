import { registerAs } from '@nestjs/config';

import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import validateConfig from '../../utils/validate-config';

import { MailerConfig } from './mailer-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  APP_DOMAIN!: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MAIL_PORT!: number;

  @IsString()
  @IsOptional()
  MAIL_HOST!: string;

  @IsString()
  @IsOptional()
  MAIL_USER!: string;

  @IsString()
  @IsOptional()
  MAIL_PASSWORD!: string;

  @IsEmail()
  @IsOptional()
  MAIL_DEFAULT_EMAIL!: string;

  @IsString()
  @IsOptional()
  MAIL_DEFAULT_NAME!: string;

  @IsBoolean()
  @IsOptional()
  MAIL_IGNORE_TLS!: boolean;

  @IsBoolean()
  @IsOptional()
  MAIL_SECURE!: boolean;

  @IsBoolean()
  @IsOptional()
  MAIL_REQUIRE_TLS!: boolean;

  // @IsString()
  // @IsOptional()
  // RESEND_API_KEY!: string;

  // @IsString()
  // @IsOptional()
  // RESEND_AUDIENCE_ID!: string;
}

export default registerAs<MailerConfig>('mailer', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT
      ? Number.parseInt(process.env.MAIL_PORT, 10)
      : 587,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    defaults: {
      from: {
        name: process.env.MAIL_DEFAULT_NAME || 'Your App',
        address: process.env.MAIL_DEFAULT_EMAIL || 'noreply@example.com',
      },
    },
    preview: process.env.NODE_ENV !== 'production',
  };
});
