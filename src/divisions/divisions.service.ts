import { Injectable } from '@nestjs/common';
import { Division } from './entities/division.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateDivisionDto } from './dto/create-division.dto';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(Division)
    private divisionRepository: Repository<Division>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async addDivisionToWorkspace(
    workspaceId: number,
    divisionData: CreateDivisionDto,
  ): Promise<Division> {
    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const division = this.divisionRepository.create({
      ...divisionData,
      workspace: workspace,
    });
    return this.divisionRepository.save(division);
  }
}
