import { HttpException, Injectable } from '@nestjs/common';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { Workspace } from './entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}
  create(createWorkspaceDto: CreateWorkspaceInput) {
    return this.workspaceRepository.save(createWorkspaceDto);
  }

  async findAll() {
    return this.workspaceRepository.find();
  }

  async findOne(id: number) {
    return this.workspaceRepository.findOneBy({ id: id });
  }

  update(id: number, updateWorkspaceInput: UpdateWorkspaceInput) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return this.workspaceRepository.delete(id);
  }

  // async getDivisions(id: number) {
  //   const workspace = await this.workspaceRepository.findOne({
  //     where: { id: id },
  //     relations: ['divisions'],
  //   });
  //
  //   if (!workspace) {
  //     throw new HttpException('Workspace not found', 404);
  //   }
  //
  //   return workspace.divisions;
  // }

  addUsers(id: number, userIds: number[]) {
    return this.workspaceRepository
      .createQueryBuilder()
      .relation(Workspace, 'users')
      .of(id)
      .add(userIds);
  }
}
