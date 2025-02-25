import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '../core/database/prisma.module';
import { MailerModule } from '../core/mailer/mailer.module';

import { AdminService } from './admin.service';
import { UserService } from './user/user.service';

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule, MailerModule],
  providers: [Logger, AdminService, UserService],
  controllers: [],
  exports: [AdminService, UserService],
})
export class AdminModule {}
