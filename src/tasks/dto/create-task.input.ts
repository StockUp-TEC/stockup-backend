import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  dueDate: Date;

  @Field(() => Int)
  statusId: number;

  @Field(() => Int)
  projectId: number;

  @Field(() => Int, { nullable: true })
  userId: number;

  @Field(() => Int, { nullable: true })
  effort: number;

  @Field(() => Int, { nullable: true })
  priorityId: number;
}
