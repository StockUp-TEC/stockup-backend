import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MailersendService } from './mailersend.service';
import { EmailParams, Recipient, Sender } from 'mailersend';
import { SendEmailInput } from './send-email.input';
import { Personalization } from 'mailersend/lib/modules/Email.module';

@Resolver()
export class MailersendResolver {
  constructor(private readonly mailersendService: MailersendService) {}
}
