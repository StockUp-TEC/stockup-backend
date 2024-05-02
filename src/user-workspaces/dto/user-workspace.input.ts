import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UserWorkspaceInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  roleId: number;
}
