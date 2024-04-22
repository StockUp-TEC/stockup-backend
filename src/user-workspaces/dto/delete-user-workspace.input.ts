import { InputType, Field, ID } from '@nestjs/graphql';
import { UserWorkspaceInput } from './user-workspace.input';

@InputType()
export class DeleteUserWorkspaceInput {
  @Field(() => ID)
  workspaceId: number;

  @Field(() => [UserWorkspaceInput])
  userData: UserWorkspaceInput[];
}
