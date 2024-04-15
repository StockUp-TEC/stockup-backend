import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateDivisionInput {
  @Field(() => String)
  public name: string;

  @Field(() => String)
  public description: string;

  @Field(() => ID)
  public workspaceId: number;
}
