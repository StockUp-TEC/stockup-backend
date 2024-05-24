import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Mutation(() => Company)
  createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ) {
    return this.companiesService.create(createCompanyInput);
  }

  @Query(() => [Company], { name: 'companies' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Query(() => Company, { name: 'company' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.companiesService.findOne(id);
  }

  @Mutation(() => Company)
  updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ) {
    return this.companiesService.update(updateCompanyInput);
  }

  @Mutation(() => Boolean)
  removeCompany(@Args('id', { type: () => Int }) id: number) {
    return this.companiesService.remove(id);
  }

  @Mutation(() => Boolean)
  addUserToCompany(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('companyId', { type: () => Int }) companyId: number,
  ) {
    return this.companiesService.addUserToCompany(userId, companyId);
  }

  @Mutation(() => Boolean)
  removeUserFromCompany(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('companyId', { type: () => Int }) companyId: number,
  ) {
    return this.companiesService.removeUserFromCompany(userId, companyId);
  }

  @Mutation(() => Boolean)
  updateCompanyUsers(
    @Args('companyId', { type: () => Int }) companyId: number,
    @Args('userIds', { type: () => [Int] }) userIds: number[],
  ) {
    return this.companiesService.updateCompanyUsers(companyId, userIds);
  }
}
