import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateUserWorkspaceInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  workspaceId: number;

  @Field(() => ID)
  roleId: number;
}
