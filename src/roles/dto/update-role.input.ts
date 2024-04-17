import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput {
  @Field(() => ID)
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [ID], { nullable: true })
  permissionIds?: number[];
}
