import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from '../core/database/prisma.module';
import { MailerModule } from '../core/mailer/mailer.module';

import { NewsletterService } from './newsletter.service';
// import { ResendService } from './resend.service';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    EventEmitterModule.forRoot(),
    MailerModule,
  ],
  providers: [
    NewsletterService,
    //ResendService
  ],
  exports: [NewsletterService],
})
export class NewsletterModule {}
