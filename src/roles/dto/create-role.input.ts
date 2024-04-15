import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => ID)
  workspaceId: number;

  @Field(() => [ID])
  permissionIds: number[];
}
