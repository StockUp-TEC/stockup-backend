import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserRoleInput {
  @Field()
  id: number;

  @Field()
  roleId: number;

  @Field()
  workspaceId: number;
}
