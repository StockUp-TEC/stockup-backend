import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDivisionInput {
  @Field(() => String)
  public name: string;

  @Field(() => String)
  public description: string;
}
