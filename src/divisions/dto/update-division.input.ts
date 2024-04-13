import { CreateDivisionInput } from './create-division.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDivisionInput extends PartialType(CreateDivisionInput) {
  @Field(() => Int)
  id: number;
}
