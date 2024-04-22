import { Module } from '@nestjs/common';
import { MailersendService } from './mailersend.service';
import { MailersendResolver } from './mailersend.resolver';

@Module({
  providers: [MailersendService, MailersendResolver],
  exports: [MailersendService],
})
export class MailersendModule {}
