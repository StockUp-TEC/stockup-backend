import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateEvidenceInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [Int])
  userIds: number[];

  @Field(() => [Int])
  companyIds: number[];
}
