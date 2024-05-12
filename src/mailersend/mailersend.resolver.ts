import { Resolver } from '@nestjs/graphql';
import { MailersendService } from './mailersend.service';

@Resolver()
export class MailersendResolver {
  constructor(private readonly mailersendService: MailersendService) {}
}
