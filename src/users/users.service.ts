import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { Role } from '../roles/entities/role.entity';
import { UserWorkspace } from '../user-workspaces/entities/user-workspace.entity';
import { CreateSponsorInput } from './dto/create-sponsor.input';
import { Company } from '../companies/entities/company.entity';
import { MailersendService } from '../mailersend/mailersend.service';

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
      throw new Error('User not found');
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

  async me(authId: string) {
    const user = await this.userRepository.findOne({
      where: { authProviderId: authId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserInput) {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
