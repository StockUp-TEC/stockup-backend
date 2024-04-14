import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PermissionGroup {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;
}
