import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UserDivisionInput {
  @Field(() => Int)
  public userId: number;

  @Field(() => Boolean)
  public isAdmin: boolean;
}
