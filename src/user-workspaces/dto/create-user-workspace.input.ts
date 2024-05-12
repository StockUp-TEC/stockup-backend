import { Field, InputType, Int } from '@nestjs/graphql';
import { UserWorkspaceInput } from './user-workspace.input';

@InputType()
export class CreateUserWorkspaceInput {
  @Field(() => Int)
  workspaceId: number;

  @Field(() => [UserWorkspaceInput])
  userData: UserWorkspaceInput[];
}
