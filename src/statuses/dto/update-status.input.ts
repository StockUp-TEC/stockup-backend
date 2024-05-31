import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateStatusInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  color: string;

  @Field(() => Int, { nullable: true })
  nextStatusId: number;
}
