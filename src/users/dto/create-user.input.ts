import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  roleId: number;

  @Field()
  workspaceId: number;
}
