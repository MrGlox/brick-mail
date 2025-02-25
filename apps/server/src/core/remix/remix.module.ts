import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminModule } from '../../admin/admin.module';
import { AuthModule } from '../../auth/auth.module';
import { NewsletterModule } from '../../newsletter/newsletter.module';
import { PaymentModule } from '../../payment/payment.module';

import { PrismaService } from '../database/prisma.service';
import { EventModule } from '../event/event.module';
import { NotificationModule } from '../notification/notification.module';
import { TokenModule } from '../token/token.module';

import { RemixController } from './remix.controller';
import { RemixService } from './remix.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    // Custom modules
    AdminModule,
    AuthModule,
    EventModule,
    PaymentModule,
    NotificationModule,
    NewsletterModule,
    TokenModule,
  ],
  providers: [RemixService, PrismaService],
  controllers: [RemixController],
  exports: [RemixService],
})
export class RemixModule {}
