import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendEmailInput {
  @Field(() => String)
  fromEmail: string;

  @Field(() => String)
  fromName: string;

  @Field(() => String)
  toEmail: string;

  @Field(() => String)
  toName: string;

  @Field(() => String)
  subject: string;

  @Field(() => String)
  template_id: string;
}
