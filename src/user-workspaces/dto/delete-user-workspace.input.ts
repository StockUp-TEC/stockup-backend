import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class DeleteUserWorkspaceInput {
  @Field(() => ID)
  workspaceId: number;

  @Field(() => [ID])
  userIds: number[];
}
