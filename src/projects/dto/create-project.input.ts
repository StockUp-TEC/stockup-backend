import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field()
  name: string;

  @Field(() => Date)
  dueDate: Date;

  @Field()
  divisionId: number;

  @Field(() => Number)
  backgroundId: number;
}
