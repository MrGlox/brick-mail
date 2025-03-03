import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { IStrategyOptionsWithRequest, Strategy } from 'passport-local';

import { PrismaService } from '../../core/database/prisma.service';
import { RedirectException } from '../../core/redirected-error.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly prisma: PrismaService) {
    super({
      passReqToCallback: true,
      usernameField: 'email',
    } as IStrategyOptionsWithRequest);
  }

  async validate(request: Request) {
    const token = request.query.token as string;

    const session = await this.prisma.session.findUnique({
      where: {
        sessionToken: token,
      },
      select: {
        user: {
          select: {
            email: true,
            id: true,
          },
        },
      },
    });

    if (!session) {
      throw new RedirectException('session_expired', '/signin');
    }

    const { user } = session;

    return { email: user.email, id: user.id };
  }
}
