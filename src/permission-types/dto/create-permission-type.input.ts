import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePermissionTypeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
