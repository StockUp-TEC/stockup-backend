import { CreatePermissionTypeInput } from './create-permission-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePermissionTypeInput extends PartialType(CreatePermissionTypeInput) {
  @Field(() => Int)
  id: number;
}
