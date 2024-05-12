import { CreateUserDivisionInput } from './create-user-division.input';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserDivisionInput extends PartialType(
  CreateUserDivisionInput,
) {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  divisionId: number;

  @Field(() => Boolean)
  isAdmin: boolean;
}
