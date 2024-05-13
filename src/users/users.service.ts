import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { Role } from '../roles/entities/role.entity';
import { UserWorkspace } from '../user-workspaces/entities/user-workspace.entity';
import { CreateSponsorInput } from './dto/create-sponsor.input';
import { Company } from '../companies/entities/company.entity';
import { MailersendService } from '../mailersend/mailersend.service';
import { UserDivision } from '../user-divisions/entities/user-division.entity';
import { UpdateUserRoleInput } from './dto/update-user-role.input';

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
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(UserDivision)
    private userDivisionRepository: Repository<UserDivision>,
    private readonly mailersendService: MailersendService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const { email, roleId, workspaceId } = createUserInput;

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

    // Check if the user already exists
    let user = await this.userRepository.findOneBy({ email });

    if (!user) {
      user = this.userRepository.create({ email });
      await this.userRepository.save(user);
      try {
        // Send welcome email
        await this.mailersendService.sendWelcomeEmail(
          email,
          workspace.name,
          role.name === 'Patrocinador',
        );
      } catch (error) {
        console.error('Error sending welcome email', error);
      }
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

    return this.userRepository.findOne({
      where: { id: user.id },
      relations: {
        workspaces: true,
        companies: true,
        userWorkspaces: true,
        userDivisions: true,
      },
    });
  }

  async createSponsor(createSponsorInput: CreateSponsorInput) {
    const { email, companyId, workspaceId } = createSponsorInput;

    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const company = await this.companyRepository.findOneBy({ id: companyId });

    if (!company) {
      throw new Error('Company not found');
    }

    const role = await this.roleRepository.findOneBy({ name: 'Patrocinador' });

    // Check if the user already exists
    let user = await this.userRepository.findOneBy({ email });

    if (!user) {
      user = this.userRepository.create({ email });
      await this.userRepository.save(user);
      try {
        // Send welcome email
        await this.mailersendService.sendWelcomeEmail(
          email,
          workspace.name,
          role.name === 'Patrocinador',
        );
      } catch (error) {
        console.error('Error sending welcome email', error);
      }
    }

    // Create and save the UserWorkspace entry
    const userWorkspace = this.userWorkspaceRepository.create({
      userId: user.id,
      user: user,
      workspace: workspace,
      role: role,
    });

    await this.userWorkspaceRepository.save(userWorkspace);

    // Create and save the UserCompany entry
    user.companies = [company];
    await this.userRepository.save(user);

    return this.userRepository.findOne({
      where: { id: user.id },
      relations: {
        workspaces: true,
        companies: true,
        userWorkspaces: true,
        userDivisions: true,
      },
    });
  }

  findByIds(ids: number[]) {
    return this.userRepository.findBy({ id: In(ids) });
  }

  async findAll(first?: number) {
    return await this.userRepository.find({
      take: first,
      relations: {
        workspaces: true,
        companies: true,
        userWorkspaces: true,
        userDivisions: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        workspaces: true,
        companies: true,
        userWorkspaces: true,
        userDivisions: true,
      },
    });
    if (!user) {
      throw new Error(`User with id: ${id} not found`);
    }

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        workspaces: true,
        companies: true,
        userWorkspaces: true,
        userDivisions: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUserAuthData(
    email: string,
    name: string,
    authId: string,
    imageUrl: string,
    phoneNumber: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.update(user.id, {
      name,
      authProviderId: authId,
      imageUrl,
      phoneNumber,
    });

    return true;
  }

  async me(authId: string) {
    const user = await this.userRepository.findOne({
      where: { authProviderId: authId },
      relations: {
        workspaces: true,
        companies: true,
        userWorkspaces: true,
        userDivisions: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateRole(input: UpdateUserRoleInput) {
    const { id, roleId, workspaceId } = input;

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }

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

    const userWorkspace = await this.userWorkspaceRepository.findOneBy({
      userId: id,
      workspaceId: workspaceId,
    });

    if (!userWorkspace) {
      throw new Error('User not found in workspace');
    }

    userWorkspace.role = role;
    await this.userWorkspaceRepository.save(userWorkspace);

    return true;
  }

  async remove(id: number) {
    // Delete all UserWorkspace entries
    await this.userWorkspaceRepository.delete({ userId: id });

    // Delete all UserDivision entries
    await this.userDivisionRepository.delete({ userId: id });

    // Delete the user
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new Error(`User with id ${id} not found`);
    }

    return true;
  }
}
