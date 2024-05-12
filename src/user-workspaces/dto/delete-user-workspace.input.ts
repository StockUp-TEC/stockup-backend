import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DeleteUserWorkspaceInput {
  @Field(() => Int)
  workspaceId: number;

  @Field(() => [Int])
  userIds: number[];
}
