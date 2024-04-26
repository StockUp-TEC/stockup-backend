import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserDivisionsService } from './user-divisions.service';
import { UserDivision } from './entities/user-division.entity';
import { CreateUserDivisionInput } from './dto/create-user-division.input';
import { UpdateUserDivisionInput } from './dto/update-user-division.input';

@Resolver(() => UserDivision)
export class UserDivisionsResolver {
  constructor(private readonly userDivisionService: UserDivisionsService) {}

  // @Mutation(() => UserDivision)
  // assignUserToDivision(
  //   @Args('createUserDivisionInput')
  //   createUserDivisionInput: CreateUserDivisionInput,
  // ) {
  //   return this.userDivisionService.assignUsersToDivision(
  //     createUserDivisionInput,
  //   );
  // }

  // @Mutation(() => UserDivision)
  // updateUserDivisionAdminStatus(
  //   @Args('updateUserDivisionInput')
  //   updateUserDivisionInput: UpdateUserDivisionInput,
  // ): Promise<UserDivision> {
  //   return this.userDivisionService.updateUserDivisionAdminStatus(
  //     updateUserDivisionInput,
  //   );
  // }

  // @Mutation(() => Boolean)
  // removeUserFromDivision(
  //   @Args('userId', { type: () => Int }) userId: number,
  //   @Args('divisionId', { type: () => Int }) divisionId: number,
  // ) {
  //   return this.userDivisionService.removeUserFromDivision(userId, divisionId);
  // }

  @Query(() => [UserDivision])
  listDivisionsForUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.userDivisionService.listDivisionsForUser(userId);
  }

  @Query(() => [UserDivision])
  listUsersForDivision(
    @Args('divisionId', { type: () => Int }) divisionId: number,
  ) {
    return this.userDivisionService.listUsersForDivision(divisionId);
  }

  @Mutation(() => Boolean)
  async setDivisionUsers(@Args('input') input: CreateUserDivisionInput) {
    return this.userDivisionService.setDivisionUsers(input);
  }
}
