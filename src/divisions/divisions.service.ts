import { Injectable } from '@nestjs/common';
import { CreateDivisionInput } from './dto/create-division.input';
import { UpdateDivisionInput } from './dto/update-division.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from './entities/division.entity';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { UserDivisionsService } from '../user-divisions/user-divisions.service';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(Division)
    private divisionRepository: Repository<Division>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    private readonly userDivisionService: UserDivisionsService,
  ) {}

  // create(createDivisionInput: CreateDivisionInput) {
  //   return this.divisionRepository.save(createDivisionInput);
  // }

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

  async remove(id: number) {
    const result = await this.divisionRepository.delete(id);
    return result.affected > 0;
  }

  async addDivisionToWorkspace(
    divisionData: CreateDivisionInput,
  ): Promise<Division> {
    const workspace = await this.workspaceRepository.findOneBy({
      id: divisionData.workspaceId,
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const division = this.divisionRepository.create({
      ...divisionData,
      workspace: workspace,
    });
    await this.divisionRepository.save(division);

    await this.userDivisionService.assignUsersToDivision({
      divisionId: division.id,
      userData: divisionData.userDivisions,
    });

    return await this.divisionRepository.findOne({
      where: { id: division.id },
      relations: {
        workspace: true,
        userDivisions: true,
      },
    });
  }
}
