import { CreateBackgroundInput } from './create-background.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBackgroundInput extends PartialType(CreateBackgroundInput) {
  @Field(() => Int)
  id: number;
}
