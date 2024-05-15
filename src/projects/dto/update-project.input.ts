import { CreateProjectInput } from './create-project.input';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProjectInput {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Date)
  dueDate: Date;

  @Field()
  backgroundId: number;
}
