import { InputType, Int, Field } from '@nestjs/graphql';
import { UserDivisionInput } from './user-division.input';

@InputType()
export class CreateUserDivisionInput {
  @Field(() => Int)
  divisionId: number;

  @Field(() => [UserDivisionInput])
  userData: UserDivisionInput[];
}
