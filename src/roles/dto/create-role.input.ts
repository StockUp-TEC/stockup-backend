import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;
}
