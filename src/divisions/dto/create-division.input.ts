import { InputType, Field, Int } from '@nestjs/graphql';
import { UserDivisionInput } from '../../user-divisions/dto/user-division.input';

@InputType()
export class CreateDivisionInput {
  @Field(() => String)
  public name: string;

  @Field(() => String)
  public description: string;

  @Field(() => Int)
  public workspaceId: number;

  @Field(() => [UserDivisionInput])
  public userDivisions: UserDivisionInput[];
}
