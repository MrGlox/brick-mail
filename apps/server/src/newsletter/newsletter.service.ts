import crypto from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { Newsletter } from '@repo/database';

import { PrismaService } from '../core/database/prisma.service';
import { MailerService } from '../core/mailer/mailer.service';
import { hashWithSalt } from '../core/utils/crypt';

// import { ResendService } from './resend.service';

@Injectable()
export class NewsletterService {
  constructor(
    private readonly mailer: MailerService,
    private readonly prisma: PrismaService, // private readonly resendService: ResendService,
  ) {}

  public async subscribeToNewsletter(
    email: string,
    firstName: string,
    interests: string,
    lang = 'en',
  ): Promise<Newsletter> {
    let user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      const password = crypto.randomBytes(16).toString('hex');
      const { hash, salt } = await hashWithSalt(password);

      user = await this.prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: `user_${salt}.${hash}`,
          pseudo: firstName,
        },
      });
    }

    const newsletter = await this.prisma.newsletter.create({
      data: {
        email: user.email,
        type: 'SUBSCRIBE',
        description: interests,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Add contact to Resend audience
    // await this.resendService.addContactToAudience(
    //   user.email,
    //   firstName,
    //   interests,
    // );

    // Send welcome email using existing mailer service
    await this.mailer.sendMail({
      template: 'newsletter-confirm',
      subject: 'Newsletter',
      lang: lang || user.preferredLocale,
      to: user.email,
      data: {
        firstName,
        interests,
      },
    });

    return newsletter;
  }

  public async unsubscribeFromNewsletter(email: string): Promise<void> {
    const newsletter = await this.prisma.newsletter.findFirst({
      where: { email, active: true },
    });

    if (newsletter) {
      await this.prisma.newsletter.update({
        where: { id: newsletter.id },
        data: { active: false },
      });

      // Remove contact from Resend audience
      // await this.resendService.removeContactFromAudience(email);
    }
  }

  // public async sendNewsletter(newsletter: Newsletter) {
  //   const newsletter = await this.prisma.newsletter.create({
  //     data: newsletter,
  //   });
  // }
}
