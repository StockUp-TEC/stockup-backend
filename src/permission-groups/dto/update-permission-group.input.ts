import { CreatePermissionGroupInput } from './create-permission-group.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePermissionGroupInput extends PartialType(CreatePermissionGroupInput) {
  @Field(() => Int)
  id: number;
}
