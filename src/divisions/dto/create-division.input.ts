import { InputType, Field, ID } from '@nestjs/graphql';
import { UserDivisionInput } from '../../user-divisions/dto/user-division.input';

@InputType()
export class CreateDivisionInput {
  @Field(() => String)
  public name: string;

  @Field(() => String)
  public description: string;

  @Field(() => ID)
  public workspaceId: number;

  @Field(() => [UserDivisionInput])
  public userDivisions: UserDivisionInput[];
}
