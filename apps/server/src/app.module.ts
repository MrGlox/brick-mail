import path, { join } from 'node:path';

import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

import googleConfig from './auth/google/config/google.config';
import appConfig from './core/config/app.config';
import mailerConfig from './core/mailer/config/mailer.config';
import stripeConfig from './payment/config/stripe.config';

import { PrismaModule } from './core/database/prisma.module';
import { EventModule } from './core/event/event.module';
import { HealthModule } from './core/health/health.module';
import { MailerModule } from './core/mailer/mailer.module';
import { NotificationModule } from './core/notification/notification.module';
import { RemixModule } from './core/remix/remix.module';
import { SchedulerModule } from './core/scheduler/scheduler.module';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { WebhookController } from './payment/events/webhook.controller';
import { WebhookService } from './payment/events/webhook.service';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, googleConfig, mailerConfig, stripeConfig],
      envFilePath: path.resolve(__dirname, '../../../.env'),
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage'),
        loaderOptions: {
          path: join(__dirname, '/core/locales/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    AdminModule,
    AuthModule,
    EventModule,
    HealthModule,
    RemixModule,
    MailerModule,
    NewsletterModule,
    NotificationModule,
    PaymentModule,
    PrismaModule,
    SchedulerModule,
  ],
  controllers: [WebhookController],
  providers: [Logger, WebhookService],
})
export class AppModule {}
