import crypto from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Profile, User } from '@repo/database';

import { PrismaService } from '../../core/database/prisma.service';
import { MailerService } from '../../core/mailer/mailer.service';
import { hashWithSalt } from '../../core/utils/crypt';

export type UserWithProfile = User & {
  // THIS IS DTO
  profile: Profile | null;
};

@Injectable()
export class UserService {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
  ) {}

  public readonly getUsers = async (): Promise<UserWithProfile[]> => {
    return await this.prisma.user.findMany({
      where: {
        role: {
          not: 'ADMIN',
        },
        status: {
          not: 'DELETED',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        profile: true,
      },
    });
  };

  public readonly getUser = async (email: string): Promise<User | null> => {
    return await this.prisma.user.findUnique({ where: { email } });
  };

  public readonly upsertUser = async (
    user: Prisma.UserCreateInput,
  ): Promise<User> => {
    const salt = crypto.randomBytes(16).toString('hex');
    const { hash } = await hashWithSalt(salt);

    try {
      const newUser = await this.prisma.user.upsert({
        where: { email: user.email },
        update: {
          ...user,
        },
        create: {
          ...user,
          password: `pwd_${salt}.${hash}`,
        },
      });

      this.logger.log(`User created: ${newUser.id}`);

      return newUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error}`);
      throw error;
    }
  };

  public readonly upsertProfile = async (
    userId: User['id'],
    profile: Prisma.ProfileCreateInput,
  ): Promise<Profile> => {
    return await this.prisma.profile.upsert({
      where: { userId },
      update: {
        ...profile,
      },
      create: {
        ...profile,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  };

  public readonly sendInvitation = async (
    userId: string,
    desc?: string,
  ): Promise<void> => {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      this.logger.error(`User not found: ${userId}`);
      throw new Error(`User not found: ${userId}`);
    }

    // Create an invitation token that expires in 7 days
    const token = await this.prisma.token.create({
      data: {
        userId,
        type: 'VERIFY_EMAIL',
        token: crypto.randomBytes(32).toString('hex'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    const invitationUrl = `${process.env.APP_DOMAIN}/invitation?token=${token.token}`;

    await this.mailer.sendMail({
      to: user.email,
      template: 'invitation-email',
      data: {
        url: invitationUrl,
        desc: desc || '',
      },
    });

    this.logger.log(`Invitation sent to: ${user.email}`);
  };

  public readonly updateUser = async (
    id: string,
    user: Prisma.UserUpdateInput,
  ): Promise<User> => {
    return this.prisma.user.update({ where: { id }, data: user });
  };

  public readonly deleteUser = async (id: string): Promise<User> => {
    return this.prisma.user.delete({ where: { id } });
  };
}
