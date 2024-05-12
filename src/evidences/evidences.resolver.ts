import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { EvidencesService } from './evidences.service';
import { Evidence } from './entities/evidence.entity';
import { CreateEvidenceInput } from './dto/create-evidence.input';

@Resolver(() => Evidence)
export class EvidencesResolver {
  constructor(private readonly evidencesService: EvidencesService) {}

  @Mutation(() => Evidence)
  createEvidence(
    @Args('createEvidenceInput') createEvidenceInput: CreateEvidenceInput,
    @Context() context,
  ) {
    const authId = context.req.user.sub;
    return this.evidencesService.create(createEvidenceInput, authId);
  }

  @Mutation(() => Evidence)
  removeEvidence(@Args('id', { type: () => Int }) id: number) {
    return this.evidencesService.remove(id);
  }
}
