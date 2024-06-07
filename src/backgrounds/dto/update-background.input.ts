import { CreateBackgroundInput } from './create-background.input';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBackgroundInput extends PartialType(CreateBackgroundInput) {
  @Field(() => Int)
  id: number;
}
