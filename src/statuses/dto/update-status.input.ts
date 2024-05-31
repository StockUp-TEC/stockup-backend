import { CreateStatusInput } from './create-status.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStatusInput extends PartialType(CreateStatusInput) {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  color: string;

  @Field(() => Int, { nullable: true })
  nextStatusId: number;
}
