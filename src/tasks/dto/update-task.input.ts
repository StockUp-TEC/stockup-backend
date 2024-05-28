import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  statusId?: number;

  @Field(() => Int, { nullable: true })
  projectId?: number;

  @Field(() => Int, { nullable: true })
  assignedId?: number;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  priorityId?: number;

  @Field({ nullable: true })
  effort?: number;

  @Field({ nullable: true })
  description?: string;
}
