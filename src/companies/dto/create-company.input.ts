import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCompanyInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field()
  workspaceId: number;
}
