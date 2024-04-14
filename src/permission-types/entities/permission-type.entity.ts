import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PermissionType {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  type: string;
}
