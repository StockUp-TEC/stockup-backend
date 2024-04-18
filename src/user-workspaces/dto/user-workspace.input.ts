import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UserWorkspaceInput {
  @Field(() => ID)
  userId: number;

  @Field(() => ID)
  roleId: number;
}
