import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MailerService } from './mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [Logger, MailerService],
  exports: [MailerService],
})
export class MailerModule {}
