import { Injectable } from '@nestjs/common';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
import { Personalization } from 'mailersend/lib/modules/Email.module';

@Injectable()
export class MailersendService {
  private client: MailerSend;

  constructor() {
    this.client = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    });
  }

  async sendWelcomeEmail(toEmail: string, workspace: string, sponsor: boolean) {
    const sender = new Sender(
      'no-reply@trial-0r83ql3jvqpgzw1j.mlsender.net',
      'StockUp Team',
    );

    const recipient = new Recipient(toEmail);

    const personalization: Personalization[] = [
      {
        email: toEmail,
        data: {
          workspace: workspace,
        },
      },
    ];
    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo([recipient])
      .setReplyTo(sender)
      .setPersonalization(personalization)
      .setTemplateId(sponsor ? '3vz9dlev0v74kj50' : 'jy7zpl9m0m3g5vx6')
      .setSubject('Bienvenido al equipo');

    const response = await this.client.email.send(emailParams);
    return response.statusCode === 202;
  }
}
