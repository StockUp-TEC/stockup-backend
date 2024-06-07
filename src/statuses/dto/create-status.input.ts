import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateStatusInput {
  @Field()
  name: string;

  @Field()
  color: string;

  @Field(() => Int)
  projectId: number;

  @Field(() => Int, { nullable: true })
  nextStatusId: number;
}
