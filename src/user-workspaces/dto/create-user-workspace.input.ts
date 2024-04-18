import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { UserWorkspaceInput } from './user-workspace.input';

@InputType()
export class CreateUserWorkspaceInput {
  @Field(() => ID)
  workspaceId: number;

  @Field(() => [UserWorkspaceInput])
  userData: UserWorkspaceInput[];
}
