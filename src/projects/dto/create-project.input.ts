import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field()
  name: string;

  @Field(() => Date)
  dueDate: Date;

  @Field()
  divisionId: number;

  @Field()
  backgroundId: number;

  @Field()
  assignedId: number;
}
