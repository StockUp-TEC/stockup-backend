import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWorkspaceInput {
  @Field()
  public name: string;

  @Field()
  public description: string;
}
