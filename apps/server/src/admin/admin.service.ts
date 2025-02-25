import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../core/database/prisma.service';

import { UserService } from './user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
    public readonly user: UserService,
  ) {}

  async retrieveAnAdmin(): Promise<boolean> {
    this.logger.log('Retrieving an admin');

    const admin = await this.prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
      },
    });

    return !!admin;
  }

  // async isAdmin(): Promise<boolean> {
  //   const user = await this.user.getUser(user.id);
  //   return user.role === 'ADMIN';
  // }

  async dashboard(): Promise<any> {
    return {
      users: await this.user.getUsers(),
    };
  }
}
