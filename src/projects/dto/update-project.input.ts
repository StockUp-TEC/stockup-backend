import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProjectInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field(() => Date, { nullable: true })
  dueDate: Date;

  @Field({ nullable: true })
  reason: string;

  @Field({ nullable: true })
  backgroundId: number;

  @Field(() => [Int], { nullable: true })
  userIds: number[];
}
