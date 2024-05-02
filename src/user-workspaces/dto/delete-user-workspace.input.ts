import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class DeleteUserWorkspaceInput {
  @Field(() => Int)
  workspaceId: number;

  @Field(() => [Int])
  userIds: number[];
}
