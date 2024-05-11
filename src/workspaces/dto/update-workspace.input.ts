import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceInput } from './create-workspace.input';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateWorkspaceInput extends PartialType(CreateWorkspaceInput) {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  color: string;
}
