import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDivisionInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  divisionId: number;

  @Field(() => Boolean, { defaultValue: false })
  isAdmin: boolean;
}
