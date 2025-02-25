import { Controller } from '@nestjs/common';

import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Get('methods')
  // async listPaymentMethods(@Query('customerId') customerId: string) {
  //   return await this.adminService.listPaymentMethods(customerId);
  // }
}
