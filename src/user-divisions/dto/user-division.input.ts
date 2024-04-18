import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UserDivisionInput {
  @Field(() => ID)
  public userId: number;

  @Field(() => Boolean)
  public isAdmin: boolean;
}
