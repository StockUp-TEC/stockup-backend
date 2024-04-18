import { Injectable } from '@nestjs/common';
import { CreateDivisionInput } from './dto/create-division.input';
import { UpdateDivisionInput } from './dto/update-division.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from './entities/division.entity';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(Division)
    private divisionRepository: Repository<Division>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  create(createDivisionInput: CreateDivisionInput) {
    return this.divisionRepository.save(createDivisionInput);
  }

  findAll() {
    return this.divisionRepository.find({
      relations: {
        workspace: true,
        userDivisions: true,
      },
    });
  }

  findOne(id: number) {
    return this.divisionRepository.findOne({
      where: { id },
      relations: {
        workspace: true,
        userDivisions: true,
      },
    });
  }

  update(id: number, updateDivisionInput: UpdateDivisionInput) {
    return `This action updates a #${id} division`;
  }

  remove(id: number) {
    return this.divisionRepository.delete(id);
  }

  async addDivisionToWorkspace(
    workspaceId: number,
    divisionData: CreateDivisionInput,
  ): Promise<Division> {
    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const division = this.divisionRepository.create({
      ...divisionData,
      // workspace: workspace,
    });
    return this.divisionRepository.save(division);
  }
}
