import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MailersendService } from './mailersend.service';
import { EmailParams, Recipient, Sender } from 'mailersend';
import { SendEmailInput } from './send-email.input';
import { Personalization } from 'mailersend/lib/modules/Email.module';

@Resolver()
export class MailersendResolver {
  constructor(private readonly mailersendService: MailersendService) {}

  @Mutation(() => Boolean)
  sendEmail(@Args('sendEmailInput') sendEmailInput: SendEmailInput) {
    const sender = new Sender(
      sendEmailInput.fromEmail,
      sendEmailInput.fromName,
    );

    const recipient = new Recipient(
      sendEmailInput.toEmail,
      sendEmailInput.toName,
    );

    const personalization: Personalization[] = [
      {
        email: sendEmailInput.toEmail,
        data: {
          name: sendEmailInput.toName,
          month: 'April',
          project: [
            {
              date: '2024-04-13',
              name: 'Terrenator',
              status: 'In Progress',
            },
          ],
          account_name: 'StockUp',
          support_email: sendEmailInput.fromEmail,
        },
      },
    ];
    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo([recipient])
      .setReplyTo(sender)
      .setPersonalization(personalization)
      .setTemplateId(sendEmailInput.template_id)
      .setSubject(sendEmailInput.subject);

    return this.mailersendService.sendEmail(emailParams);
  }
}
