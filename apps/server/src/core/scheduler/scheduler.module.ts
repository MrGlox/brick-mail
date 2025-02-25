import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { SchedulerService } from './scheduler.service';

import { PaymentModule } from '../../payment/payment.module';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, PaymentModule],
  providers: [Logger, SchedulerService],
})
export class SchedulerModule {}
