import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStatusInput {
  @Field()
  name: string;

  @Field()
  color: string;

  @Field(() => Int)
  workspaceId: number;

  @Field(() => Int, { nullable: true })
  nextStatusId: number;
}
