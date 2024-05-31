import { CreateStatusInput } from './create-status.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStatusInput extends PartialType(CreateStatusInput) {
  @Field()
  name: string;

  @Field()
  color: string;

  @Field()
  nextStatusId: number;
}
