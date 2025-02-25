import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CookieSerializer } from '../core/cookie-serializer';
import { PrismaModule } from '../core/database/prisma.module';
import { PrismaService } from '../core/database/prisma.service';
import { MailerService } from '../core/mailer/mailer.service';
import { TokenService } from '../core/token/token.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleController } from './google/google.controller';
import { GoogleStrategy } from './google/google.strategy';
import { LocalAuthGuard } from './local/local.guard';
import { LocalStrategy } from './local/local.strategy';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({
      defaultStrategy: 'local',
      property: 'user',
      session: true,
    }),
    PrismaModule,
  ],
  controllers: [AuthController, GoogleController],
  providers: [
    Logger,
    LocalStrategy,
    LocalAuthGuard,
    GoogleStrategy,
    CookieSerializer,
    PrismaService,
    AuthService,
    MailerService,
    TokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
