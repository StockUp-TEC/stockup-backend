import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStatusInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
