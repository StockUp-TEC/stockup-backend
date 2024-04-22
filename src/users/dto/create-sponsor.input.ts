import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSponsorInput {
  @Field()
  email: string;

  @Field()
  companyId: number;

  @Field()
  workspaceId: number;
}
