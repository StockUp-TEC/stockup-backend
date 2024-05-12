import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEvidenceInput {
  @Field()
  name: string;

  @Field()
  description: string;
}
