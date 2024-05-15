import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBackgroundInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
