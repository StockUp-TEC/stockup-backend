import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { Role } from '../roles/entities/role.entity';
import { UserWorkspace } from '../user-workspaces/entities/user-workspace.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserWorkspace)
    private userWorkspaceRepository: Repository<UserWorkspace>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const { email, name, studentId, roleId, workspaceId } = createUserInput;

    // Create and save the user
    const user = this.userRepository.create({ email, name, studentId });
    await this.userRepository.save(user);

    // Find the workspace and role by their IDs
    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const role = await this.roleRepository.findOneBy({ id: roleId });

    if (!role) {
      throw new Error('Role not found');
    }

    // Create and save the UserWorkspace entry
    const userWorkspace = this.userWorkspaceRepository.create({
      userId: user.id,
      workspaceId: workspace.id,
      roleId: role.id,
      user: user,
      workspace: workspace,
      role: role,
    });
    await this.userWorkspaceRepository.save(userWorkspace);

    return user;
  }

  async findAll(first?: number) {
    return await this.userRepository.find({
      take: first,
      relations: ['workspaces'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['workspaces'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async me(authId: string) {
    const user = await this.userRepository.findOne({
      where: { authProviderId: authId },
      relations: ['workspaces'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserInput) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
