import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => [ID])
  permissionIds: number[];
}
