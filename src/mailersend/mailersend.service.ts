import { Injectable } from '@nestjs/common';
import { EmailParams, MailerSend } from 'mailersend';

@Injectable()
export class MailersendService {
  private client: MailerSend;

  constructor() {
    this.client = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    });
  }

  async sendEmail(emailParams: EmailParams) {
    const response = await this.client.email.send(emailParams);
    return response.statusCode === 202;
  }
}
