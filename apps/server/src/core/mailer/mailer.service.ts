import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import nodemailer from 'nodemailer';

import { AllConfigType } from '../../core/config/config.type';
import { kebabize } from '../utils/kebabize';

import { render } from '@react-email/render';
import { TemplateType, Templates } from './templates';

interface SendMailConfiguration {
  from?: string;
  template: any;
  to: string;
  subject?: string;
  lang?: string;
  text?: string;
  data?: any;
}

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly config: ConfigService<AllConfigType>,
    private readonly i18n: I18nService,
    private readonly logger: Logger,
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.get('mailer.host', { infer: true }),
      port: config.get('mailer.port', { infer: true }),
      ignoreTLS: config.get('mailer.ignoreTLS', { infer: true }),
      secure: config.get('mailer.secure', { infer: true }),
      requireTLS: config.get('mailer.requireTLS', { infer: true }),
      auth: {
        user: config.get('mailer.user', { infer: true }),
        pass: config.get('mailer.password', { infer: true }),
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
    });

    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('SMTP Connection Error:', error);
      } else {
        this.logger.log('SMTP Server is ready to take our messages');
      }
    });
  }

  async generateEmail(template: TemplateType, data: any) {
    const html = await render(
      Templates[kebabize(`${template}`) as keyof typeof Templates](data),
    );

    return html;
  }

  async sendMail({
    from,
    to,
    template,
    subject,
    data,
    lang,
  }: SendMailConfiguration) {
    const translations: { subject: string; [key: string]: any } =
      await this.i18n.translate(template, {
        lang: lang || 'en',
        args: data,
      });

    const html = await this.generateEmail(template, {
      ...(typeof translations === 'object' ? translations : {}),
      ...data,
      appName: process.env.APP_NAME,
      baseUrl: `${process.env.APP_DOMAIN}:${process.env.APP_PORT}`,
    });

    try {
      await this.transporter.sendMail({
        to: to,
        from: from
          ? from
          : `"${this.config.get('mailer.defaultName', {
              infer: true,
            })}" <${this.config.get('mailer.defaultEmail', {
              infer: true,
            })}>`,
        subject: subject || translations?.subject,
        html: html as string,
      });
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error}`);
    }

    this.logger.log(`Email sent to ${to} with template ${template}`);

    return {
      to: to,
      from: from
        ? from
        : `"${this.config.get('mailer.defaultName', {
            infer: true,
          })}" <${this.config.get('mailer.defaultEmail', {
            infer: true,
          })}>`,
      subject: translations?.subject,
      html,
    };
  }
}
