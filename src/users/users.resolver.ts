import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Role } from '../roles/entities/role.entity';
import { CreateSponsorInput } from './dto/create-sponsor.input';
import { UpdateUserRoleInput } from './dto/update-user-role.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  addUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  addSponsor(
    @Args('createSponsorInput') createSponsorInput: CreateSponsorInput,
  ) {
    return this.usersService.createSponsor(createSponsorInput);
  }

  // @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'users' })
  findAll(@Args('first', { type: () => Int, nullable: true }) first: number) {
    return this.usersService.findAll(first);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'findUserByEmail' })
  findOneByEmail(@Args('email', { type: () => String }) email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @Mutation(() => Boolean)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => Boolean)
  updateUserRole(
    @Args('updateUserRoleInput') updateUserRoleInput: UpdateUserRoleInput,
  ) {
    return this.usersService.updateRole(updateUserRoleInput);
  }

  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  // Get authenticated user
  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'me' })
  async me(@Context() context) {
    const authId = context.req.user.sub;
    if (!authId) {
      throw new Error('User not found: no authId in context');
    }
    return this.usersService.me(authId);
  }

  @ResolveField(() => Role, { name: 'role', nullable: true })
  async role(
    @Parent() user: User,
    @Args('workspaceId', { type: () => Int }) workspaceId: number,
  ) {
    if (!user.userWorkspaces) {
      return null;
    }
    const userWorkspace = user.userWorkspaces.find(
      (userWorkspace) => userWorkspace.workspaceId === workspaceId,
    );
    return userWorkspace.role;
  }
}
