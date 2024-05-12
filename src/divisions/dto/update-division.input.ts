import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateDivisionInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  public name: string;

  @Field(() => String)
  public description: string;
}
