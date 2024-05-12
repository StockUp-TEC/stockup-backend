import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { Role } from '../roles/entities/role.entity';
import { CreateSponsorInput } from './dto/create-sponsor.input';
import { UpdateUserRoleInput } from './dto/update-user-role.input';
import { IsPublic } from '../auth/public.decorator';

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

  // @Query(() => [User], { name: 'users' })
  // findAll(@Args('first', { type: () => Int, nullable: true }) first: number) {
  //   return this.usersService.findAll(first);
  // }

  // @Query(() => User, { name: 'user' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.usersService.findOne(id);
  // }

  @Query(() => User, { name: 'findUserByEmail' })
  findOneByEmail(@Args('email', { type: () => String }) email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @IsPublic()
  @Mutation(() => Boolean)
  updateUserAuthData(
    @Args('email', { type: () => String }) email: string,
    @Args('name', { type: () => String }) name: string,
    @Args('authId', { type: () => String }) authId: string,
    @Args('imageUrl', { type: () => String }) imageUrl: string,
    @Args('phoneNumber', { type: () => String, nullable: true })
    phoneNumber: string,
  ) {
    return this.usersService.updateUserAuthData(
      email,
      name,
      authId,
      imageUrl,
      phoneNumber,
    );
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
