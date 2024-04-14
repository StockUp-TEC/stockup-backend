import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePermissionGroupInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
