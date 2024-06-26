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
        userDivisions: true,
      },
    });
  }

  findOne(id: number) {
    return this.divisionRepository.findOne({
      where: { id },
      relations: {
        userDivisions: true,
      },
    });
  }

  async update(updateDivisionInput: UpdateDivisionInput) {
    const { id, ...updateInput } = updateDivisionInput;
    const division = await this.divisionRepository.findOneBy({ id });
    if (!division) {
      throw new Error('Division not found');
    }
    const result = await this.divisionRepository.update(id, updateInput);

    return result.affected > 0;
  }

  async remove(id: number) {
    await this.userDivisionService.deleteAllUsersForDivision(id);
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

    await this.userDivisionService.addUsersToDivision({
      divisionId: division.id,
      userData: divisionData.userDivisions,
    });

    return await this.divisionRepository.findOne({
      where: { id: division.id },
      relations: {
        userDivisions: true,
      },
    });
  }
}
