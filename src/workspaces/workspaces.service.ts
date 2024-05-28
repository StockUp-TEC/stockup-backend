import { Injectable } from '@nestjs/common';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { Workspace } from './entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWorkspacesService } from '../user-workspaces/user-workspaces.service';
import { User } from '../users/entities/user.entity';
import * as graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql/type';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userWorkspaceService: UserWorkspacesService,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceInput,
    authProviderId: string,
  ) {
    const wksp = await this.workspaceRepository.save(createWorkspaceDto);
    const user = await this.userRepository.findOne({
      where: { authProviderId },
    });

    await this.userWorkspaceService.addUsersToWorkspace({
      workspaceId: wksp.id,
      userData: [
        {
          userId: user.id,
          roleId: 1,
        },
      ],
    });
    return wksp;
  }

  async findAll() {
    return this.workspaceRepository.find();
  }

  async findOne(id: number, info: GraphQLResolveInfo) {
    const relations = this.getRelations(info);
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations,
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return workspace;
  }

  async update(updateWorkspaceInput: UpdateWorkspaceInput) {
    const { id, ...input } = updateWorkspaceInput;
    await this.workspaceRepository.update(id, input);
    return this.workspaceRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.userWorkspaceService.removeAllUsersFromWorkspace(id);
    return this.workspaceRepository.delete(id);
  }

  private getRelations(info: GraphQLResolveInfo): string[] {
    const fields = graphqlFields(info);
    const relations = [];

    if (fields.divisions) relations.push('divisions');
    if (fields.divisions && fields.divisions.users)
      relations.push('divisions.userDivisions');
    if (fields.users) relations.push('users');
    if (fields.users && fields.users.role)
      relations.push('users.userWorkspaces');
    if (fields.companies) relations.push('companies');
    if (fields.statuses) relations.push('statuses');

    return relations;
  }
}
